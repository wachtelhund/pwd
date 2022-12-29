import interact from 'interactjs'
const template = document.createElement('template')
template.innerHTML = `
  <div id="container-root">
    <div id="bar">
      <button>X</button>
    </div>
    <slot></slot>
  </div>
  <style>
    button{
      width: 40px;
    }
    #container-root {
      margin: 10px;
      display: inline-block;
      transition: 300ms all;
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      border-radius: 5px;
    }
    #bar {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      display: flex;
      justify-content: flex-end;
      background-color: green;
      z-index: 10;
      width: 100%;
      height: 40px;
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

    #createOptions () {
      for (const [optionName, options] of Object.entries(this.firstElementChild.options)) {
        const select = document.createElement('select')
        select.textContent = optionName
        for (const selectOption of options) {
          const option = document.createElement('option')
          option.textContent = selectOption.toUpperCase()
          setTimeout(() => {
            if (this.firstElementChild.getAttribute(optionName) === selectOption) {
              option.setAttribute('selected', true)
            }
          }, 0)
          select.appendChild(option)
        }
        select.addEventListener('change', (event) => {
          this.firstElementChild.setAttribute(optionName, event.target.value.toLowerCase())
        })
        this.#bar.appendChild(select)
      }
    }

    connectedCallback () {
      if (this.firstElementChild.options) {
        this.#createOptions()
      }
    }

    disconnectedCallback () {
      this.querySelectorAll('select').forEach((select) => {
        select.removeEventListener('change')
      })
    }
  })
