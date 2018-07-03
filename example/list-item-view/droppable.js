const html = require('choo/html')
const css = require('sheetify')
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
    color: transparent;
    position: relative;
  }
`

// the z-index is -1 because if we accidentially drag over the span then it
// will receive a dragover event and we are not preventing default and that
// will cancel the current drag
const markerStyles = css`
  :host {
    z-index: -1;
    display: block;
    width: 3px;
    background-color: blue;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.2s ease-in, left 0.03s ease-in;
  }
`

module.exports = (listView, parents, item, index, state, emit) => {
  const path = parents.concat([index])

  return html`
    <li class=${styles} data-cid=${item._cid} data-index=${index}>
      ${titleView(parents, item, path, state, emit)}
      ${nestedListView(listView, item, path, state, emit, { indent: false })}
    </li>
  `
}

function titleView (parents, item, path, state, emit) {
  let inlineMarkerStyles = `left: ${left(state, path)}px;`

  if (state.isOver && state.helpers.isArrayEqual(state.dragging.over, path)) {
    inlineMarkerStyles += `opacity: 1;`
  }

  return html`
    <p
      ondragover=${dragover}
      ondragenter=${dragenter}
      ondragleave=${dragleave}
      ondrop=${drop}
      class=${titleStyles}>
      <span class=${markerStyles} style=${inlineMarkerStyles}></span>
      ${item.title}
    </p>
  `

  function dragover (e) {
    e.preventDefault() // allow drop

    const rect = e.target.getBoundingClientRect()

    const x = e.clientX - rect.x
    const segments = Math.floor(rect.width / 32) // every 32 pixels
    const ratio = x / rect.width
    const segment = Math.floor(ratio * segments) // which segment is the mouse currently over

    if (state.dragging.overMouseSegment !== segment) {
      emit('dragover', segment)
    }
  }

  function dragenter (e) {
    e.preventDefault()

    e.dataTransfer.dropEffect = 'move'
    emit('dragenter', path)
  }

  function dragleave (e) {
    e.preventDefault()

    e.dataTransfer.dropEffect = 'none'
    emit('dragleave', path)
  }

  function drop (e) {
    e.stopPropagation()
    e.preventDefault()

    const data = e.dataTransfer.getData('application/json')
    emit('drop', { path, data })
  }
}

function left (state, path) {
  const left = state.dragging.overSegment || 0
  return (left * 32) + 3 // 32 is our indent amount and we nudge it a bit to make it more visible
}
