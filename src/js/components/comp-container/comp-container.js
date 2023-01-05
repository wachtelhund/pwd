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
      background-color: rgba(95, 95, 95, 0.50);
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
      background-color: white;
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
      background: linear-gradient(225deg, hsla(0, 0%, 25%, 1) 25%, hsla(0, 0%, 33%, 1) 52%, hsla(0, 0%, 76%, 1) 88%);
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      margin-bottom: 5px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      display: flex;
      justify-content: flex-end;
      z-index: 10;
      width: 100%;
      height: min-content;
    }

    #draggable {
      position: absolute;
      width: 100%;
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
  /**
   * Custom element for a draggable and closable container.
   *
   * Extends the HTMLElement class to create a custom element that can be used in HTML as a self-contained
   * container that can be dragged and closed by clicking a button.
   */
  class extends HTMLElement {
    /**
     * The element that contains the close button.
     *
     * @type {HTMLElement}
     * @private
     */
    #bar

    /**
     * The close button element.
     *
     * @type {HTMLElement}
     * @private
     */
    #btn

    /**
     * The root element of the container.
     *
     * @type {HTMLElement}
     * @private
     */
    #root

    /**
     * The initial X position of the root element.
     *
     * @type {number}
     * @private
     */
    #initialRootX

    /**
     * The initial X position of the root element.
     *
     * @type {number}
     * @private
     */
    #initialRootY

    /**
     * Constructor for the custom element.
     *
     * Initializes the custom element by setting up the shadow root and adding event
     * listeners to the close button and the container element.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

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

    /**
     * Creates options from the first child element's 'options' attribute and
     * appends them to the component's top bar.
     * Each option has a corresponding select element, and the selected option will be set as
     * the first child element's attribute.
     */
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

    /**
     * This function is called when the custom element is inserted into the DOM. If the first child element has options
     * defined, it creates those options as select elements in the component's bar.
     * It also sets the element's position to absolute, makes it draggable, and sets the tabIndex to 0.
     */
    connectedCallback () {
      if (this.firstElementChild.options) {
        this.#createOptions()
      }
      this.style.position = 'absolute'
      this.#makeDraggable()
      this.tabIndex = 0
    }

    /**
     * Makes the element draggable by adding mouse event listeners to the element's bar.
     * When the bar is clicked and held, the element can be moved around the screen by dragging it.
     * When the bar is released, the element will stay in its new position.
     */
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

    /**
     * Removes event listeners when the element is removed from the DOM.
     */
    disconnectedCallback () {
      this.#bar.removeEventListener('mousedown', this)
      this.#bar.removeEventListener('mousemove', this)
      this.#bar.removeEventListener('mouseup', this)
      this.querySelectorAll('select').forEach((select) => {
        select.removeEventListener('change')
      })
    }
  })
