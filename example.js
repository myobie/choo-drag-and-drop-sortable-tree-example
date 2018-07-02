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

const styles = css('./example.css')

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
