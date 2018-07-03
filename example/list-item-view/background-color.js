module.exports = (state, path) => {
  if (state.helpers.isArrayEqual(state.selected, path)) {
    return 'yellow'
  } else {
    return 'white'
  }
}
