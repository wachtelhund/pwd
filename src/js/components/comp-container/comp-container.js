//import interact from 'interactjs'
const template = document.createElement('template')
template.innerHTML = `
  <div id="container-root">
      <div id="bar">
          <button>X</button>
      </div>
    <slot></slot>
  </div>
  <style>
    button, select {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 40px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 24px;
      background-color: rgba(47, 47, 47, 0.95);
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      color: white;
      padding: 10px;
      margin: 5px;
      border: none;
      transition: 200ms all;
    }
    button, select:hover {
      transform: scale(1.05);
    }
    button, select:active {
      transform: scale(0.95);
    }
    select {
      font-size: unset;
      width: unset;
    }

    #container-root {
      position: absolute;
      margin: 10px;
      display: inline-block;
      transition: 300ms all;
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      border-radius: 5px;
    }

    #container-root:focus {
      outline: none;
    }

    #bar {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      display: flex;
      justify-content: flex-end;
      background-color: rgba(205, 205, 205, 0.8);
      z-index: 10;
      width: 100%;
      height: min-content;
    }

    #draggable {
      position: absolute;
      width: 100%;
      background-color: rgba(205, 0, 0, 0.8);
    }

    .big {
      height: 100vh;
      width: 100vw;
      bottom: 0;
    }

    .fadeout {
      transform: scale(0)
    }
  </style>
`
customElements.define('comp-container',
  class extends HTMLElement {
    #draggable
    #bar
    #btn
    #root
    #initialRootX
    #initialRootY
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#draggable = this.shadowRoot.querySelector('#draggable')
      this.#bar = this.shadowRoot.querySelector('#bar')
      this.#root = this.shadowRoot.querySelector('#container-root')
      this.#btn = this.shadowRoot.querySelector('button')
      this.#btn.addEventListener('click', (event) => {
        this.shadowRoot.querySelector('#container-root').classList.toggle('fadeout')
        setTimeout(() => {
          this.parentElement.removeChild(this)
        }, 300)
      })
      this.addEventListener('focusout', (event) => {
        this.style.zIndex = 0
      })
      this.addEventListener('focusin', (event) => {
        this.style.zIndex = 100
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
        this.#bar.insertBefore(select, this.#btn)
      }
    }

    connectedCallback () {
      if (this.firstElementChild.options) {
        this.#createOptions()
      }
      this.style.position = 'absolute'
      this.#makeDraggable()
      this.tabIndex = 0
    }

    #makeDraggable () {
      this.#initialRootX = 0
      this.#initialRootY = 0
      let moveElement = false

      this.#bar.addEventListener('mousedown', (event) => {
        this.focus()
        this.style.zIndex = 100
        this.#initialRootX = event.clientX
        this.#initialRootY = event.clientY
        moveElement = true
      })

      this.#bar.addEventListener('mousemove', (event) => {
        if (moveElement) {
          event.preventDefault()

          const rootX = event.clientX
          const rootY = event.clientY

          this.style.left = this.offsetLeft - (this.#initialRootX - rootX) + 'px'
          this.style.top = this.offsetTop - (this.#initialRootY - rootY) + 'px'

          this.#initialRootX = rootX
          this.#initialRootY = rootY
        }
      })

      this.#bar.addEventListener('mouseup', (event) => {
        event.preventDefault()
        moveElement = false
      })

      this.#bar.addEventListener('mouseleave', (event) => {
        event.preventDefault()
        moveElement = false
      })
    }

    disconnectedCallback () {
      this.#bar.removeEventListener('mousedown', this)
      this.#bar.removeEventListener('mousemove', this)
      this.#bar.removeEventListener('mouseup', this)
      this.querySelectorAll('select').forEach((select) => {
        select.removeEventListener('change')
      })
    }
  })
