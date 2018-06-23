const html = require('choo/html')
const css = require('sheetify')

const divStyles = css`
  :host {
    position: relative;
    width: 100%;
    height: 100%;
  }
`

const listStyles = css`
  :host {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
`

module.exports = (state, emit) => html`
  <div class=${divStyles} onclick=${_ => emit('deselect')}>
    <ul class="list ma0 pa0 ${listStyles}">
      ${state.items.map(item => ghostItemView(item, state, emit))}
    </ul>
    <ul class="list ma0 pa0 ${listStyles}">
      ${state.items.map(item => draggableItemView(item, state, emit))}
    </ul>
  </div>
`

const ghostItemStyles = css`
  :host {
    box-sizing: border-box;
    padding: 6px 12px;
    height: 30px;
    margin: 4px;
    position: relative;
    transition: top 0.2s ease-in-out;
  }
`

function ghostItemView (item, state, emit) {
  let opacity = '0'
  let top = '0'
  let backgroundColor = 'white'

  if (state.dragging.fromID && state.dragging.fromID !== item.id) {
    // show everyone except for the one being dragged
    opacity = '1'
  }

  if (state.dragging.overID) {
    let index = state.helpers.indexOf(item.id)

    if (state.dragging.fromIndex < index && index <= state.dragging.overIndex) {
      // came from above and I am between where it was and where it wants to go
      top = '-34px'
    } else if (state.dragging.fromIndex > index && index >= state.dragging.overIndex) {
      // came from below and I am between where it was and where it wants to go
      top = '34px'
    }
  }

  if (state.selectedItem === item.id) {
    backgroundColor = 'yellow'
  }

  const inlineStyles = `top: ${top}; opacity: ${opacity}; background-color: ${backgroundColor};`

  return html`
    <li
      class=${ghostItemStyles}"
      style=${inlineStyles}>
      ${item.title}
    </li>
  `
}

const draggableItemStyles = css`
  :host {
    box-sizing: border-box;
    padding: 6px 12px;
    height: 30px;
    margin: 4px;
    max-width: 20em;
    position: relative;
  }
`

function draggableItemView (item, state, emit) {
  let opacity = '1'
  let backgroundColor = 'white'

  if (state.dragging.fromID) {
    // hide all the real items so we can animate the ghost ones
    opacity = '0'
  }

  if (state.selectedItem === item.id) {
    backgroundColor = 'yellow'
  }

  const inlineStyles = `opacity: ${opacity}; background-color: ${backgroundColor};`

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
      class=${draggableItemStyles}"
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
    emit('select', item.id)
  }
}
