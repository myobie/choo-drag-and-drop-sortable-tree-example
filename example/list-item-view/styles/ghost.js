const shared = require('./shared')

module.exports = `
  :host {
    ${shared}
    position: relative;
    transition: top 0.2s ease-in-out;
  }
`
