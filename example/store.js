module.exports = (state, emitter) => {
  state.headline = 'Rearrange the list below'

  emitter.emit(state.events.DOMTITLECHANGE, `Sortable tree example: ${state.headline}`)

  state.db = {
    type: 'root',
    id: '_root',
    children: [
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
  }

  state.selectedItem = null

  function resetDragging () {
    state.dragging = {
      from: null,
      fromIndexes: null,
      over: null,
      overIndexes: null
    }
  }

  resetDragging() // start out resetted

  emitter.on('dragstart', path => {
    state.dragging.from = path
    state.dragging.fromIndexes = indexesOf(path)
    render()
  })

  emitter.on('dragover', path => {
    state.dragging.over = path
    state.dragging.overIndexes = indexesOf(path)
    render()
  })

  emitter.on('drop', ({ path, data }) => {
    insertItemAfterItem(state.dragging.from, path)
    // dragend will render
  })

  emitter.on('dragend', () => {
    resetDragging()
    render()
  })

  emitter.on('select', path => {
    state.selectedItem = path
    render()
  })

  emitter.on('deselect', () => {
    state.selectedItem = null
    render()
  })

  state.helpers = {
    indexesOf,
    pathOfItem,
    isArrayEqual,
    isChildOf
  }

  function render () { return emitter.emit('render') }

  function insertItemAfterItem (movingPath, landmarkPath) {
    let movingIndexes = indexesOf(movingPath)
    let landmarkIndexes = indexesOf(landmarkPath)

    let movingParent = findParent(movingIndexes)
    let movingItemIndex = movingIndexes[movingIndexes.length - 1]

    let landmarkParent = findParent(landmarkIndexes)
    let landmarkItemIndex = landmarkIndexes[landmarkIndexes.length - 1]

    const removedItem = movingParent.children.splice(movingItemIndex, 1)[0]
    landmarkParent.children.splice(landmarkItemIndex, 0, removedItem)

    // FIXME: must change the id of removedItem if any other items at it's new level have the same id
  }

  function findParent (indexes) {
    indexes = indexes.slice(0, -1) // everything except the last item

    let item = state.db
    let scope = item.children

    for (let i of indexes) {
      if (!Array.isArray(scope)) { return null }

      item = scope[i]
      scope = item.children
    }

    return item
  }

  function isArrayEqual (left, right) {
    if (!Array.isArray(left) || !Array.isArray(right)) { return false }

    if (left.length !== right.length) { return false }

    return rightArrayIncludesOrEqualsLeftArray(isArrayEqual, left, right)
  }

  function isChildOf (parentPath, path) {
    if (!Array.isArray(parentPath) || !Array.isArray(path)) { return false }

    if (parentPath.length >= path.length) { return false }

    return rightArrayIncludesOrEqualsLeftArray(isChildOf, parentPath, path)
  }

  function rightArrayIncludesOrEqualsLeftArray (recurse, left, right) {
    for (let i in left) {
      const leftV = left[i]
      const rightV = right[i]

      if (Array.isArray(leftV) && Array.isArray(rightV)) {
        return recurse(leftV, rightV)
      } else if (leftV !== rightV) {
        return false
      }
    }

    return true
  }

  function pathOfItem (parents, item) {
    return parents.map(p => p.id).concat([item.id])
  }

  function indexesOf (path) {
    let result = []
    let scope = state.db.children

    for (let place of path) {
      if (!Array.isArray(scope)) { return null }

      let index = scope.findIndex(item => item.id === place)

      if (index === -1) {
        return null
      } else {
        result.push(index)
        scope = scope[index].children
      }
    }

    return result
  }
}
