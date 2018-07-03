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
  const path = parents.concat([item._cid])

  return html`
    <li class=${styles} data-cid=${item._cid}>
      ${titleView(parents, item, path, state, emit)}
      ${nestedListView(listView, parents, item, path, state, emit)}
    </li>
  `
}

function titleView (parents, item, path, state, emit) {
  const zindex = 999 - parents.length
  const inlineStyles = `z-index: ${zindex}; opacity: ${opacity(state)}; background-color: ${backgroundColor(state, path)};`

  return html`
    <p
      draggable="true"
      ondragstart=${dragstart}
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

  function dragend (e) {
    e.preventDefault()

    emit('dragend')
  }

  function select (e) {
    e.stopPropagation()
    e.preventDefault()

    if (!state.helpers.isArrayEqual(state.selected, path)) {
      emit('select', path)
    }
  }
}

function opacity (state) {
  if (state.isDragging) {
    return '0'
  } else {
    return '1'
  }
}
