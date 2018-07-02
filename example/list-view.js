const html = require('choo/html')
const css = require('sheetify')

const ghostItemView = require('./list-item-view/ghost')
const draggableItemView = require('./list-item-view/draggable')
const droppableItemView = require('./list-item-view/droppable')

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

const droppableWrapperStyles = css`
  :host {
    z-index: 4;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
`

const listStyles = css`
  :host {
    z-index: 3;
    position: relative;
    width: 100%;
  }
`

module.exports = view

function view (parents, children, state, emit) {
  return html`
    <div class=${styles}>
      ${ghost(parents, children, state, emit)}
      ${draggable(parents, children, state, emit)}
      ${droppable(parents, children, state, emit)}
    </div>
  `
}

function ghost (parents, children, state, emit) {
  return html`
    <div class=${ghostWrapperStyles}>
      ${ghostListView(parents, children, state, emit)}
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

function droppable (parents, children, state, emit) {
  if (state.isDragging) {
    return html`
      <div class=${droppableWrapperStyles}>
        ${droppableListView(parents, children, state, emit)}
      </div>
    `
  } else {
    return html`<div class=${droppableWrapperStyles}></div>`
  }
}

function droppableListView (parents, children, state, emit) {
  return html`
    <ul class="list ma0 pa0 ${listStyles}">
      ${children.map(item => droppableItemView(droppableListView, parents, item, state, emit))}
    </ul>
  `
}

function draggable (parents, children, state, emit) {
  return html`
    <div>
      ${draggableListView(parents, children, state, emit)}
    </div>
  `
}

function draggableListView (parents, children, state, emit) {
  return html`
    <ul class="list ma0 pa0 ${listStyles}">
      ${children.map(item => draggableItemView(draggableListView, parents, item, state, emit))}
    </ul>
  `
}
