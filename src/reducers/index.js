// reducers
import alert from './alert.js'
import authenticate from './authenticate.js'
import clear from './clear.js'
import codeChange from './codeChange.js'
import cursorBeforeSearch from './cursorBeforeSearch.js'
import cursorHistory from './cursorHistory.js'
import deleteSubthoughts from './deleteSubthoughts.js'
import dragInProgress from './dragInProgress.js'
import editing from './editing.js'
import editingValue from './editingValue.js'
import error from './error.js'
import existingThoughtDelete from './existingThoughtDelete.js'
import existingThoughtMove from './existingThoughtMove.js'
import expandContextThought from './expandContextThought.js'
import invalidState from './invalidState.js'
import loadLocalState from './loadLocalState.js'
import modalComplete from './modalComplete.js'
import modalRemindMeLater from './modalRemindMeLater.js'
import render from './render.js'
import search from './search.js'
import searchLimit from './searchLimit.js'
import selectionChange from './selectionChange.js'
import setCursor from './setCursor.js'
import showModal from './showModal.js'
import status from './status.js'
import thoughtIndex from './thoughtIndex.js'
import toggleCodeView from './toggleCodeView.js'
import toggleContextView from './toggleContextView.js'
import toggleHiddenThoughts from './toggleHiddenThoughts.js'
import toggleQueue from './toggleQueue.js'
import toggleSidebar from './toggleSidebar.js'
import toggleSplitView from './toggleSplitView'
import updateSplitPosition from './updateSplitPosition'
import tutorial from './tutorial.js'
import tutorialChoice from './tutorialChoice.js'
import tutorialStep from './tutorialStep.js'
import { setToolbarOverlay, prioritizeScroll } from './toolbarOverlay.js'

import { initialState } from '../util'

export default (state = initialState(), action) => {
  return Object.assign({}, state, (({

    alert,
    authenticate,
    clear,
    codeChange,
    cursorBeforeSearch,
    cursorHistory,
    deleteSubthoughts,
    dragInProgress,
    editing,
    editingValue,
    error,
    existingThoughtDelete,
    existingThoughtMove,
    expandContextThought,
    invalidState,
    loadLocalState,
    modalComplete,
    modalRemindMeLater,
    prioritizeScroll,
    render,
    search,
    searchLimit,
    selectionChange,
    setCursor,
    setToolbarOverlay,
    showModal,
    status,
    thoughtIndex,
    toggleCodeView,
    toggleContextView,
    toggleHiddenThoughts,
    toggleQueue,
    toggleSidebar,
    toggleSplitView,
    tutorial,
    tutorialChoice,
    tutorialStep,
    updateSplitPosition,

  })[action.type] || (() => {
    if (!action.type.startsWith('@@')) {
      console.error('Unrecognized action:', action.type, action)
    }
    return state
  }))(state, action))
}
