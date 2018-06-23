const html = require('choo/html')
const css = require('sheetify')
const backgroundColor = require('./background-color')

const styles = css('./styles/draggable.js')

module.exports = (item, state, emit) => {
  const inlineStyles = `opacity: ${opacity(state, item)}; background-color: ${backgroundColor(state, item)};`

  return html`
    <li
      draggable="true"
      ondragstart=${dragstart}
      ondragover=${dragover}
      ondragenter=${dragenter}
      ondragleave=${dragleave}
      ondrop=${drop}
      ondragend=${dragend}
      onclick=${select}
      class=${styles}"
      style=${inlineStyles}>
      ${item.title}
    </li>
  `

  function dragstart (e) {
    e.dataTransfer.effectAllowed = 'move'

    const data = JSON.stringify({ item })
    e.dataTransfer.setData('application/json', data)

    emit('dragstart', item.id)
  }

  function dragover (e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (state.dragging.overID !== item.id) {
      emit('dragover', item.id)
    }
  }

  function dragenter (e) {
  }

  function dragleave (e) {
  }

  function drop (e) {
    e.stopPropagation()

    if (state.dragging.fromID !== item.id) {
      const data = e.dataTransfer.getData('application/json')
      emit('drop', { id: item.id, data })
    }
  }

  function dragend (e) {
    emit('dragend')
  }

  function select (e) {
    e.stopPropagation()
    e.preventDefault()

    if (state.selectedItemID !== item.id) {
      emit('select', item.id)
    }
  }
}

function opacity (state, item) {
  if (state.dragging.fromID) {
    return '0'
  } else {
    return '1'
  }
}
