module.exports = (state, emitter) => {
  state.headline = 'Rearrange the list below'

  emitter.emit(state.events.DOMTITLECHANGE, `Sortable tree example: ${state.headline}`)

  state.items = [
    {
      type: 'group',
      id: 'one',
      title: 'Group One',
      children: [
        { type: 'item', id: 'one', title: 'One' },
        { type: 'item', id: 'two', title: 'Two' },
        { type: 'item', id: 'three', title: 'Three' },
        { type: 'item', id: 'four', title: 'Four' },
        { type: 'item', id: 'five', title: 'Five' },
        { type: 'item', id: 'six', title: 'Six' }
      ]
    },
    { type: 'item', id: 'middle', title: 'An item in-between two groups' },
    {
      type: 'group',
      id: 'two',
      title: 'Group Two',
      children: [
        { type: 'item', id: 'one two', title: 'One 2' },
        { type: 'item', id: 'two two', title: 'Two 2' },
        { type: 'item', id: 'three two', title: 'Three 2' },
        {
          type: 'group',
          id: 'very-nested',
          title: 'A very nested group',
          children: [
            { type: 'item', id: 'super-nested', title: 'A super nested item' }
          ]
        }
      ]
    },
    {
      type: 'group',
      id: 'three',
      title: 'Group Three',
      children: [
        { type: 'item', id: '🍎', title: '🍎' },
        { type: 'item', id: '😓', title: '😓' },
        { type: 'item', id: '⛈', title: '⛈' }
      ]
    }
  ]

  state.selectedItemID = null

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

  emitter.on('select', id => {
    state.selectedItemID = id
    render()
  })

  emitter.on('deselect', () => {
    state.selectedItemID = null
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
