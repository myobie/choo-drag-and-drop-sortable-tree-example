module.exports = (state, item) => {
  if (state.selectedItem && state.selectedItem._cid === item._cid) {
    return 'yellow'
  } else {
    return 'white'
  }
}
