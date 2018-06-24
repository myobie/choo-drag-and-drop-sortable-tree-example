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
  const path = state.helpers.pathOfItem(parents, item)

  return html`
    <li class=${styles}>
      ${titleView(parents, item, path, state, emit)}
      ${nestedListView(listView, parents, item, path, state, emit)}
    </li>
  `
}

function titleView (parents, item, path, state, emit) {
  const inlineStyles = `top: ${top(state, path)}; opacity: ${opacity(state, path)}; background-color: ${backgroundColor(state, path)};`

  return html`
    <p class=${titleStyles} style=${inlineStyles}>
      ${item.title}
    </p>
  `
}

function opacity (state, path) {
  if (!state.dragging.from) { return '0' }

  // show everyone except for the one being dragged
  if (state.helpers.isArrayEqual(state.dragging.from, path)) {
    return '0'
  } else {
    return '1'
  }
}

function top (state, path) {
  let indexes = state.helpers.indexesOf(path)

  if (state.dragging.fromIndexes < indexes && indexes <= state.dragging.overIndexes) {
    // came from above and I am between where it was and where it wants to go
    return '-34px'
  } else if (state.dragging.fromIndexes > indexes && indexes >= state.dragging.overIndexes) {
    // came from below and I am between where it was and where it wants to go
    return '34px'
  } else {
    return '0'
  }
}
