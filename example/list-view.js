const html = require('choo/html')
const css = require('sheetify')

const ghostItemView = require('./list-item-view/ghost')
const draggableItemView = require('./list-item-view/draggable')

const styles = css`
  :host {
  }
`

const ghostWrapperStyles = css`
  :host {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
`

const listStyles = css`
  :host {
    position: relative;
    width: 100%;
  }
`

module.exports = view

function view (parents, children, state, emit) {
  return html`
    <div class=${styles}>
      <div class=${ghostWrapperStyles}>
        ${ghostListView(parents, children, state, emit)}
      </div>
      ${draggableListView(parents, children, state, emit)}
    </div>
  `
}

function ghostListView (parents, children, state, emit) {
  return html`
    <ul class="list ma0 pa0 ${listStyles}">
      ${children.map(item => ghostItemView(ghostListView, parents, item, state, emit))}
    </ul>
  `
}

function draggableListView (parents, children, state, emit) {
  return html`
    <ul class="list ma0 pa0 ${listStyles}" style="z-index: 999;">
      ${children.map(item => draggableItemView(draggableListView, parents, item, state, emit))}
    </ul>
  `
}
