const css = require('sheetify')
const html = require('choo/html')

const nestedDivStyles = css`
  :host {
    margin-left: 32px;
    position: relative;
    overflow: visible;
  }
`

module.exports = (view, parents, item, path, state, emit) => {
  // if this item doesn't have children, then do nothing
  if (!Array.isArray(item.children)) { return '' }
  // if this is the currently dragged item, then don't render it's children
  if (state.helpers.isArrayEqual(state.dragging.from, path)) { return '' }

  parents = parents.slice(0) // copy
  parents.push(item)

  return html`
    <div class=${nestedDivStyles}>
      ${view(parents, item.children, state, emit)}
    </div>
  `
}
