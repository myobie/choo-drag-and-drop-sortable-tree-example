const html = require('choo/html')
const css = require('sheetify')

const { ghostItemView, draggableItemView } = require('./list-item-view')

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
