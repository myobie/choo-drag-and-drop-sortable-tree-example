module.exports = (state, item) => {
  if (state.selectedItemID === item.id) {
    return 'yellow'
  } else {
    return 'white'
  }
}
