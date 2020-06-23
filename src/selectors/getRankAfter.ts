import { ROOT_TOKEN } from '../constants'
import { getThoughtsRanked } from '../selectors'
import { equalThoughtValue, headRank, headValue, rootedContextOf } from '../util'
import { Path } from '../types'
import { State } from '../util/initialState'

/** Gets a new rank after the given thought in a list but before the following thought. */
export default (state: State, thoughtsRanked: Path) => {

  const value = headValue(thoughtsRanked)
  const rank = headRank(thoughtsRanked)
  const context = rootedContextOf(thoughtsRanked)
  const children = getThoughtsRanked(state, context)

  // if there are no children, start with rank 0
  if (children.length === 0) {
    return 0
  }
  // if there is no value, it means nothing is selected
  // get rank after the last child
  else if (value === undefined || value === ROOT_TOKEN) {
    // guard against NaN/undefined
    return (children[children.length - 1].rank || 0) + 1
  }

  let i = children.findIndex(child => child.value === value && child.rank === rank) // eslint-disable-line fp/no-let

  // quick hack for context view when rank has been supplied as 0
  if (i === -1) {
    i = children.findIndex(equalThoughtValue(value))
  }

  // cannot find thoughts with given rank
  if (i === -1) {
    return 0
  }

  const prevSubthought = children[i]
  const nextSubthought = children[i + 1]

  const newRank = nextSubthought
    ? (prevSubthought.rank + nextSubthought.rank) / 2
    : prevSubthought.rank + 1

  // guard against NaN/undefined
  return newRank || 0
}