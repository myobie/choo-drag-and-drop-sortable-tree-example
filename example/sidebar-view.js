const html = require('choo/html')
const css = require('sheetify')

const listView = require('./list-view')

const styles = css`
  :host {
    min-height: 100%;
    overflow: hidden;
  }
`

module.exports = (state, emit) => html`
  <div class=${styles} onclick=${_ => emit('deselect')}>
    ${listView(state.items, state, emit)}
  </div>
`
