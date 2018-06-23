const choo = require('choo')
const html = require('choo/html')
const css = require('sheetify')

const sidebar = require('./example/sidebar-view')
const store = require('./example/store')

const app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}

app.use(store)

css('tachyons')

const styles = css`
  [draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }

  :host > header {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 45px;
  }

  :host > main {
    background-color: #ddd;
    position: absolute;
    top: 45px;
    right: 0;
    bottom: 45px;
    left: 0;
  }

  :host > main > aside {
    overflow-y: scroll;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 300px;
  }

  :host > main > section {
    overflow-y: scroll;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 300px;
    background: white;
    padding: 40px;
  }

  :host > footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 45px;
    background-color: black;
    color: #eee;
  }
`

app.route('*', (state, emit) => {
  return html`
    <body class="sans-serif ${styles}">
      <header>
        <h1 class="ma0 pa1">${state.headline}</h1>
      </header>
      <main>
        <aside>
          ${sidebar(state, emit)}
        </aside>
        <section>
          ${Array(50).fill().map(() => {
            return html`<p>Other stuff might go here</p>`
          })}
        </section>
      </main>
      <footer>
        <p class="ma0 pa1">You should be able to rearrange the above tree view.</p>
      </footer>
    </body>
  `
})

app.mount('body')
