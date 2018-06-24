module.exports = (state, path) => {
  if (state.helpers.isChildOf(state.dragging.from, path)) {
    return 'none'
  } else {
    return 'block'
  }
}
