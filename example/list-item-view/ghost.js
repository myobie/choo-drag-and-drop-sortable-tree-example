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
    position: relative;
    transition: top 0.2s ease-in-out;
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
  const inlineStyles = `top: ${top(state, path)}; opacity: ${opacity(state, path)}; background-color: ${backgroundColor(state, item)};`

  return html`
    <p class=${titleStyles} style=${inlineStyles}>
      ${item.title}
    </p>
  `
}

function opacity (state, path) {
  if (!state.isDragging) { return '0' }

  // show everyone except for the one being dragged
  if (state.helpers.isArrayEqual(state.dragging.from, path)) {
    return '0'
  } else {
    return '1'
  }
}

function top (state, path) {
  const from = state.dragging.from
  const over = state.dragging.over
  const isAbove = state.helpers.isAbove
  const isAboveOrEqual = state.helpers.isAboveOrEqual
  const isBelow = state.helpers.isBelow
  const isBelowOrEqual = state.helpers.isBelowOrEqual

  if (isAbove(from, path) && isAboveOrEqual(path, over)) {
    // came from above and I am between where it was and where it wants to go
    return '-34px'
  } else if (isBelow(from, path) && isBelowOrEqual(path, over)) {
    // came from below and I am between where it was and where it wants to go
    return '34px'
  } else {
    return '0'
  }
}
