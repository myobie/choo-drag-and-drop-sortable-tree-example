let _currentCID = 0

module.exports = {
  assignCID,
  assignCIDs,
  nextCID
}

function nextCID () {
  _currentCID += 1
  return `cid-${_currentCID}`
}

function assignCID (item) {
  if (item._cid === undefined) {
    item._cid = nextCID()
  }
}

function assignCIDs (items) {
  if (!Array.isArray(items)) { return }

  for (let item of items) {
    assignCID(item)

    if (item.children) {
      assignCIDs(item.children)
    }
  }
}
