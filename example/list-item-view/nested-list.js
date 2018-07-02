const css = require('sheetify')
const html = require('choo/html')

const styles = css`
  :host {
    position: relative;
    overflow: visible;
  }
`

module.exports = (view, parents, item, path, state, emit, options = {}) => {
  // if this item doesn't have children, then do nothing
  if (!Array.isArray(item.children)) { return '' }
  // if this is the currently dragged item, then don't render it's children
  if (state.helpers.isArrayEqual(state.dragging.from, path)) { return '' }

  parents = parents.slice(0) // copy
  parents.push(item)

  let inlineStyles = ''

  if (options.indent === false) {
    inlineStyles = 'margin-left: 0;'
  } else {
    inlineStyles = 'margin-left: 32px;'
  }

  return html`
    <div class=${styles} style=${inlineStyles}>
      ${view(parents, item.children, state, emit)}
    </div>
  `
}
