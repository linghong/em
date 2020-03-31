import render from './render.js'

// util
import {
  expandThoughts,
  timestamp,
} from '../util.js'

// updates thoughtIndex and contextIndex with any number of thoughts
export default (state, { contextIndexUpdates, contextViews, cursor, forceRender, ignoreNullThoughts, recentlyEdited, thoughtIndexUpdates }) => {

  const thoughtIndexNew = {
    ...state.thoughtIndex,
    ...thoughtIndexUpdates
  }

  const contextIndexNew = {
    ...state.contextIndex,
    ...contextIndexUpdates
  }

  if (!ignoreNullThoughts) {
    // delete null thoughts
    if (thoughtIndexUpdates) {
      Object.keys(thoughtIndexUpdates).forEach(key => {
        if (thoughtIndexUpdates[key] == null) {
          delete thoughtIndexNew[key] // eslint-disable-line fp/no-delete
        }
      })
    }

    // delete empty children
    if (contextIndexUpdates) {
      Object.keys(contextIndexUpdates).forEach(contextEncoded => {
        if (!contextIndexUpdates[contextEncoded] || contextIndexUpdates[contextEncoded].length === 0) {
          delete contextIndexNew[contextEncoded] // eslint-disable-line fp/no-delete
        }
      })
    }
  }

  return {
    contextIndex: contextIndexNew,
    contextViews: contextViews || state.contextViews,
    cursor: cursor || state.cursor,
    expanded: expandThoughts(cursor || state.cursor, thoughtIndexNew, contextIndexNew, state.contextViews),
    thoughtIndex: thoughtIndexNew,
    ...(recentlyEdited ? { recentlyEdited } : null),
    ...(forceRender ? {
      ...render(state),
      lastUpdated: timestamp(),
    } : null),
  }
}
