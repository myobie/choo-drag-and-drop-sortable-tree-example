const html = require('choo/html')
const css = require('sheetify')
const backgroundColor = require('./background-color')
const nestedListView = require('./nested-list')

const styles = css`
  :host {
    box-sizing: border-box;
    position: relative;
  }
`

const titleStyles = css`
  :host {
    margin: 4px;
    margin-bottom: 0;
    padding: 6px 12px;
  }
`

module.exports = (listView, parents, item, state, emit) => {
  const path = state.helpers.pathOfItem(parents, item)

  return html`
    <li class=${styles}>
      ${titleView(parents, item, path, state, emit)}
      ${nestedListView(listView, parents, item, path, state, emit)}
    </li>
  `
}

function titleView (parents, item, path, state, emit) {
  const zindex = 999 - parents.length
  const inlineStyles = `z-index: ${zindex}; opacity: ${opacity(state, path)}; background-color: ${backgroundColor(state, path)};`

  return html`
    <p
      draggable="true"
      ondragstart=${dragstart}
      ondragover=${dragover}
      ondragenter=${dragenter}
      ondragleave=${dragleave}
      ondrop=${drop}
      ondragend=${dragend}
      onclick=${select}
      class=${titleStyles}
      style=${inlineStyles}>
      ${item.title}
    </p>
  `

  function dragstart (e) {
    e.dataTransfer.effectAllowed = 'move'

    const data = JSON.stringify({ path })
    e.dataTransfer.setData('application/json', data)

    emit('dragstart', path)
  }

  function dragover (e) {
    e.preventDefault()

    if (!state.helpers.isArrayEqual(state.dragging.over, path)) {
      emit('dragover', path)
    }
  }

  function dragenter (e) {
    e.dataTransfer.dropEffect = 'move'
  }

  function dragleave (e) {
    e.dataTransfer.dropEffect = 'none'
  }

  function drop (e) {
    e.stopPropagation()

    if (!state.helpers.isArrayEqual(state.dragging.from, path)) {
      const data = e.dataTransfer.getData('application/json')
      emit('drop', { path, data })
    }
  }

  function dragend (e) {
    emit('dragend')
  }

  function select (e) {
    e.stopPropagation()
    e.preventDefault()

    if (!state.helpers.isArrayEqual(state.selectedItem, path)) {
      emit('select', path)
    }
  }
}

function opacity (state, path) {
  if (state.dragging.from) {
    return '0'
  } else {
    return '1'
  }
}
