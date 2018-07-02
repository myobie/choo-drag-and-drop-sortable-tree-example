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
      { type: 'item', id: 'middle2', title: 'Another item in-between two groups' },
      { type: 'item', id: 'middle3', title: 'Yet another item in-between two groups' },
      {
        type: 'group',
        id: 'two',
        title: 'Group Two',
        children: [
          { type: 'item', id: 'one two', title: 'One 2' },
          {
            type: 'group',
            id: 'very-nested',
            title: 'A very nested group',
            children: [
              { type: 'item', id: 'super-nested', title: 'A super nested item' }
            ]
          },
          { type: 'item', id: 'two two', title: 'Two 2' },
          { type: 'item', id: 'three two', title: 'Three 2' }
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
    state.isDragging = false
    state.isOver = false

    state.dragging = {
      from: null,
      fromIndexes: null,
      fromItem: null,
      over: null,
      overIndexes: null,
      overItem: null,
      overMouseSegment: null,
      overSegment: null
    }
  }

  resetDragging() // start out resetted

  emitter.on('dragstart', path => {
    state.isDragging = true
    state.dragging.from = path
    state.dragging.fromIndexes = indexesOf(path)
    state.dragging.fromItem = findItemByIndexes(state.dragging.fromIndexes)
    render()
  })

  emitter.on('dragover', segment => {
    if (!state.isOver) { return }

    let lowestSegment = 0
    let highestSegment = 0

    const overLevel = state.dragging.over.length - 1
    const overItemIndex = state.dragging.overIndexes[state.dragging.overIndexes.length - 1]

    if (state.dragging.fromIndexes < state.dragging.overIndexes) {
      // from above
      const over = findItemByIndexes(state.dragging.overIndexes)
      const parent = findParent(state.dragging.overIndexes)

      if (over.type === 'group') {
        // must put it into the group if coming from above (will end up being the first item in the group)
        highestSegment = lowestSegment = overLevel + 1
      } else if (parent && parent.type === 'group' && overItemIndex === parent.children.length - 1) {
        // if the parent is a group and the item we are over is the last item then we can exit the group or we can be the last item of the group
        lowestSegment = overLevel - 1
        highestSegment = overLevel
      } else {
        // else we must simply replace the item we are over at it's same level
        lowestSegment = highestSegment = overLevel
      }
    } else if (state.dragging.fromIndexes > state.dragging.overIndexes) {
      // from below
      const prev = prevSiblingItem(state.dragging.overIndexes)

      if (prev && prev.type === 'group') {
        // is the item directly before us is a group, then we can enter the group as it's last item or simply replace the item we are over
        lowestSegment = overLevel
        highestSegment = overLevel + 1
      } else {
        lowestSegment = highestSegment = overLevel
      }
    } else {
      // same item
      const prev = prevSiblingItem(state.dragging.overIndexes)
      const parent = findParent(state.dragging.overIndexes)

      if (prev && prev.type === 'group') {
        // if the item directly above us is a group, then we can enter that group as it's last item or we can stay where we are at right now
        lowestSegment = overLevel
        highestSegment = overLevel + 1
      } else if (parent && parent.type === 'group' && overItemIndex === parent.children.length - 1) {
        // if the parent is a group and the item we are over is the last item then we can exit the group or we can remain as the last item of the group
        lowestSegment = overLevel - 1
        highestSegment = overLevel
      } else {
        // else we must simply stay where we are
        lowestSegment = highestSegment = overLevel
      }
    }

    state.dragging.overMouseSegment = segment
    state.dragging.overSegment = closestSegment(lowestSegment, highestSegment, segment)

    render()
  })

  function closestSegment (lowest, highest, desired) {
    if (desired < lowest) {
      return lowest
    }

    if (desired > highest) {
      return highest
    }

    return desired
  }

  emitter.on('dragenter', path => {
    state.isOver = true
    state.dragging.over = path
    state.dragging.overIndexes = indexesOf(path)
    state.dragging.overItem = findItemByIndexes(state.dragging.overIndexes)
    render()
  })

  emitter.on('dragleave', path => {
    state.isOver = false
    state.dragging.overMouseSegment = null
    render()
  })

  emitter.on('drop', ({ path, data }) => {
    // const overLevel = state.dragging.over.length - 1
    //
    // if (state.dragging.fromIndexes < state.dragging.overIndexes) {
    //   // from above
    //   if (overLevel === state.dragging.overSegment) {
    //   }
    //   const over = findItemByIndexes(state.dragging.overIndexes)
    //   if (over.type === 'group') {
    //   } else {
    //   }
    // } else if (state.dragging.fromIndexes > state.dragging.overIndexes) {
    //   // from below
    //   const prev = prevSiblingItem(state.dragging.overIndexes)
    //   if (prev && prev.type === 'group') {
    //   } else {
    //   }
    // } else {
    //   // same item
    //   const prev = prevSiblingItem(state.dragging.overIndexes)
    //   if (prev && prev.type === 'group') {
    //   } else {
    //   }
    // }

    insertItemAfterItem(state.dragging.from, path)
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

  // function isSibling (left, right) {
  //   if (left.length !== right.length) { return false }
  //
  //   left = left.slice(0, -1) // everything except the last item
  //   right = right.slice(0, -1) // everything except the last item
  //
  //   return isArrayEqual(left, right)
  // }

  function findParent (indexes) {
    indexes = indexes.slice(0, -1) // everything except the last item
    return findItemByIndexes(indexes)
  }

  function findItemByIndexes (indexes) {
    let item = state.db
    let scope = item.children

    for (let i of indexes) {
      if (!Array.isArray(scope)) { return null }

      item = scope[i]
      scope = item.children
    }

    return item
  }

  function prevSiblingItem (indexes) {
    const last = indexes[indexes.length - 1]
    if (last === 0) {
      return null
    } else {
      const parent = findParent(indexes)
      return parent.children[last - 1]
    }
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
