import { hashContext, hashThought } from '../util'
import { State } from '../util/initialState'
import { Index, Parent, Timestamp } from '../types'

/** Iterates through each lexeme in thoughtIndex, identifies lexeme.contexts that are not replicated in contextIndex, and generates contextIndexUpdates that are dispatched to restore them. */
const checkDataIntegrity = (state: State, max = 100000) => {

  const { contextIndex, thoughtIndex } = state.thoughts
  const contextIndexUpdates: Index<Parent> = {}

  Object.keys(thoughtIndex)
    .slice(0, max)
    .forEach(key => {
      const lexeme = thoughtIndex[key]
      if (!lexeme.contexts) return

      // check that each of the lexeme's contexts and its ancestors exist in contextIndex
      lexeme.contexts.forEach(cx => {
        if (!cx.context) return

        // subcontexts
        // Note: Concat lexeme value too else it won't check for it's ancestor io contextIndex
        [...cx.context, lexeme.value].forEach((value, i) => {

          // don't check root
          if (i === 0) return

          const context = cx.context.slice(0, i)
          // get children of the lexeme context
          const encoded = hashContext(context)
          const parentEntry = contextIndex[encoded]
          const parentEntryAccum = contextIndexUpdates[encoded]
          const children = (parentEntryAccum && parentEntryAccum.children) ||
              (parentEntry && parentEntry.children) ||
              []
          const isInContextIndex = children
            .some(child => hashThought(child.value) === hashThought(value)/* && child.rank === cx.rank */)

          // if the lexeme context is not in the contextIndex it is supposed to be, then generate an update to add it
          if (!isInContextIndex) {
            const lastUpdated = cx.lastUpdated || lexeme.lastUpdated || '' as Timestamp
            // if we're at the last context, which is the whole cx.context, use cx.rank
            // otherwise generate a large rank so it doesn't conflict
            const rank = i === cx.context.length - 1 ? cx.rank : i + 1000
            const valueNew = value
            contextIndexUpdates[encoded] = {
              context,
              children: [
                ...children.filter(child => hashThought(child.value) !== hashThought(valueNew)),
                {
                  // guard against undefined
                  lastUpdated,
                  rank,
                  value: valueNew,
                }
              ],
              lastUpdated: lastUpdated,
            }
          }
        })
      }, {})
    })

  return contextIndexUpdates
}

export default checkDataIntegrity