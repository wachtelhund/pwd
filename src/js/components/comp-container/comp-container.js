const template = document.createElement('template')
template.innerHTML = `
  <div id="container-root">
    <div id="bar">
      <button>X</button>
    </div>
    <slot></slot>
  </div>
  <style>
    #container-root {
      display: inline-block;
      z-index: 1;
      transition: 300ms all;
    }
    #bar {
      background-color: green;
      width: 100%;
      height: 40px;
      z-index: 2;
    }
    .fadeout {
      transform: scale(0)
    }
  </style>
`
customElements.define('comp-container',
  class extends HTMLElement {
    #bar
    #btn
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#bar = this.shadowRoot.querySelector('#bar')
      this.#btn = this.shadowRoot.querySelector('button')
      this.#btn.addEventListener('click', (event) => {
        this.shadowRoot.querySelector('#container-root').classList.toggle('fadeout')
        setTimeout(() => {
          this.parentElement.removeChild(this)
        }, 300)
      })
    }

    connectedCallback () {
    }
  })
