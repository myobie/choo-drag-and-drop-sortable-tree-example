module.exports = (state, path) => {
  if (state.helpers.isArrayEqual(path, state.selectedItem)) {
    return 'yellow'
  } else {
    return 'white'
  }
}
