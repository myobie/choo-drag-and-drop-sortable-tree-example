const html = require('choo/html')
const css = require('sheetify')
const backgroundColor = require('./background-color')

const styles = css('./styles/ghost.js')

module.exports = (item, state, emit) => {
  const inlineStyles = `top: ${top(state, item)}; opacity: ${opacity(state, item)}; background-color: ${backgroundColor(state, item)};`

  return html`
    <li
      class=${styles}"
      style=${inlineStyles}>
      ${item.title}
    </li>
  `
}

function opacity (state, item) {
  // show everyone except for the one being dragged
  if (state.dragging.fromID && state.dragging.fromID !== item.id) {
    return '1'
  } else {
    return '0'
  }
}

function top (state, item) {
  let index = state.helpers.indexOf(item.id)

  if (state.dragging.fromIndex < index && index <= state.dragging.overIndex) {
    // came from above and I am between where it was and where it wants to go
    return '-34px'
  } else if (state.dragging.fromIndex > index && index >= state.dragging.overIndex) {
    // came from below and I am between where it was and where it wants to go
    return '34px'
  } else {
    return '0'
  }
}
