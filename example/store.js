module.exports = (state, emitter) => {
  state.headline = 'Rearrange the list below'

  emitter.emit(state.events.DOMTITLECHANGE, `Sortable tree example: ${state.headline}`)

  state.items = [
    { id: 'one', title: 'One' },
    { id: 'two', title: 'Two' },
    { id: 'three', title: 'Three' },
    { id: 'four', title: 'Four' },
    { id: 'five', title: 'Five' },
    { id: 'six', title: 'Six' }
  ]

  function resetDragging () {
    state.dragging = {
      fromID: null,
      fromIndex: -1,
      overID: null,
      overIndex: -1
    }
  }

  resetDragging() // start out resetted

  emitter.on('dragstart', id => {
    state.dragging.fromID = id
    state.dragging.fromIndex = indexOf(id)
    render()
  })

  emitter.on('dragover', id => {
    state.dragging.overID = id
    state.dragging.overIndex = indexOf(id)
    render()
  })

  emitter.on('drop', ({ id, data }) => {
    insertItemAfterItem(state.dragging.fromID, id)
    // dragend will render
  })

  emitter.on('dragend', () => {
    resetDragging()
    render()
  })

  state.helpers = {
    indexOf
  }

  function render () { return emitter.emit('render') }

  // function findItem (id) {
  //   return state.items.find(compareItemID(id))
  // }

  function insertItemAfterItem (movingID, landmarkID) {
    const from = indexOf(movingID)
    const to = indexOf(landmarkID)

    let newItems = state.items.slice(0)

    // pop it out
    let removedItem = newItems.splice(from, 1)[0]
    // put it back
    newItems.splice(to, 0, removedItem)

    state.items = newItems
  }

  function indexOf (id) {
    return state.items.findIndex(compareItemID(id))
  }

  function compareItemID (id) {
    return function (item) {
      return id === item.id
    }
  }
}
