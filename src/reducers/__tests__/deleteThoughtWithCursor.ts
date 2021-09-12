import { HOME_TOKEN } from '../../constants'
import { initialState, reducerFlow } from '../../util'
import { exportContext } from '../../selectors'
import { store } from '../../store'
import createTestApp, { cleanupTestApp } from '../../test-helpers/createTestApp'

// reducers
import cursorBack from '../cursorBack'
import cursorUp from '../cursorUp'
import deleteThoughtWithCursor from '../deleteThoughtWithCursor'
import newSubthought from '../newSubthought'
import newThought from '../newThought'
import setCursor from '../setCursor'

it('delete thought within root', () => {
  const steps = [newThought('a'), newThought('b'), deleteThoughtWithCursor({})]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a`)
})

it('delete thought with no cursor should do nothing ', () => {
  const steps = [newThought('a'), newThought('b'), setCursor({ path: null }), deleteThoughtWithCursor({})]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a
  - b`)
})

it('delete thought within context', () => {
  const steps = [newThought('a'), newSubthought('a1'), deleteThoughtWithCursor({})]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a`)
})

it('delete descendants', () => {
  const steps = [newThought('a'), newSubthought('a1'), newSubthought('a1.1'), cursorBack, deleteThoughtWithCursor({})]

  // run steps through reducer flow and export as plaintext for readable test
  const stateNew = reducerFlow(steps)(initialState())
  const exported = exportContext(stateNew, [HOME_TOKEN], 'text/plain')

  expect(exported).toBe(`- ${HOME_TOKEN}
  - a`)
})

it('cursor should move to prev sibling', () => {
  const steps = [newThought('a'), newSubthought('a1'), newThought('a2'), newThought('a3'), deleteThoughtWithCursor({})]

  // run steps through reducer flow
  const stateNew = reducerFlow(steps)(initialState())

  expect(stateNew.cursor).toMatchObject([
    { value: 'a', rank: 0 },
    { value: 'a2', rank: 1 },
  ])
})

it('cursor should move to next sibling if there is no prev sibling', () => {
  const steps = [
    newThought('a'),
    newSubthought('a1'),
    newThought('a2'),
    newThought('a3'),
    cursorUp,
    cursorUp,
    deleteThoughtWithCursor({}),
  ]

  // run steps through reducer flow
  const stateNew = reducerFlow(steps)(initialState())

  expect(stateNew.cursor).toMatchObject([
    { value: 'a', rank: 0 },
    { value: 'a2', rank: 1 },
  ])
})

it('cursor should move to parent if the deleted thought has no siblings', () => {
  const steps = [newThought('a'), newSubthought('a1'), deleteThoughtWithCursor({})]

  // run steps through reducer flow
  const stateNew = reducerFlow(steps)(initialState())

  expect(stateNew.cursor).toMatchObject([{ value: 'a', rank: 0 }])
})

it('cursor should be removed if the last thought is deleted', () => {
  const steps = [newThought('a'), deleteThoughtWithCursor({})]

  // run steps through reducer flow
  const stateNew = reducerFlow(steps)(initialState())

  expect(stateNew.cursor).toBe(null)
})

/** Mount tests required for caret. */
describe('mount', () => {
  beforeEach(createTestApp)
  afterEach(cleanupTestApp)

  it('after deleting first child, caret should move to beginning of next sibling', () => {
    store.dispatch([
      { type: 'newThought', value: 'apple' },
      { type: 'newThought', value: 'banana' },
      { type: 'cursorUp' },
      { type: 'deleteThoughtWithCursor' },
    ])
    jest.runOnlyPendingTimers()
    expect(window.getSelection()?.focusOffset).toBe(0)
  })

  it('after deleting last child, caret should move to end of previous sibling', () => {
    store.dispatch([
      { type: 'newThought', value: 'apple' },
      { type: 'newThought', value: 'banana' },
      { type: 'deleteThoughtWithCursor' },
    ])
    jest.runOnlyPendingTimers()

    // Selection.focusOffset a number representing the offset of the selection's anchor within the focusNode. If focusNode is a text node, this is the number of characters within focusNode preceding the focus. If focusNode is an element, this is the number of chi,ld nodes of the focusNode preceding the focus.
    // In this case, the selection moves to the end of the apple element.
    expect(window.getSelection()?.focusNode?.nodeType).toBe(Node.ELEMENT_NODE)
    expect(window.getSelection()?.focusNode?.textContent).toBe('apple')
    expect(window.getSelection()?.focusOffset).toBe(1)
  })
})