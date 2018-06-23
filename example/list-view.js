const html = require('choo/html')
const css = require('sheetify')

const ghostItemView = require('./list-item-view/ghost')
const draggableItemView = require('./list-item-view/draggable')

const styles = css`
  :host {
    position: relative;
    padding: 0;
    margin-bottom: 4px;
    overflow: hidden;
  }
`

const ghostStyles = css`
  :host {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }
`

const draggableStyles = css`
  :host {
    z-index: 99;
    position: relative;
    width: 100%;
    overflow: hidden;
  }
`

const ghostListView = createListView(ghostStyles, ghostItemView)
const draggableListView = createListView(draggableStyles, draggableItemView)

module.exports = view

function view (items, state, emit) {
  return html`
    <div class=${styles}>
      ${ghostListView(items, state, emit)}
      ${draggableListView(items, state, emit)}
    </div>
  `
}

function createListView (listStyles, itemView) {
  return (items, state, emit) => html`
    <ul class="list ma0 pa0 ${listStyles}">
      ${items.map(item => itemView(item, state, emit))}
    </ul>
  `
}
