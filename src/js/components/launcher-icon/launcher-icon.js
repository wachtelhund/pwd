const template = document.createElement('template')
template.innerHTML = `
  <img tabIndex="0"/>
  <style>
    img {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      transition: 200ms all;
    }

    img:hover {
      transform: scale(1.05);
    }

    img:active {
      transform: scale(0.95);
    }
  </style>
`
customElements.define('launcher-icon',
  /**
   * A custom element that displays an icon that, when clicked, creates and inserts a new component into the DOM.
   * The type of component to be created is specified using the type attribute.
   */
  class extends HTMLElement {
    /*
    * Icon of the component.
    */
    #img
    /**
     * Type attribute of the component.
     */
    #type
    /**
     * The constructor for the launcher-icon custom element.
     * It attaches the shadow DOM to the element, appends the template content to it,
     * and adds event listeners to the icon.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.#img = this.shadowRoot.querySelector('img')
      this.#img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.target.click()
        }
      })
      this.#img.addEventListener('click', (event) => {
        const container = document.createElement('comp-container')
        const app = document.createElement(this.#type)
        container.appendChild(app)
        this.parentElement.parentElement.insertBefore(container, this.parentElement)
      })
    }

    /**
     * Callback function that is called when the element is inserted into the DOM.
     * If the type attribute is not set, it throws an error. Otherwise, it sets the src and alt
     * attributes of the img element and sets the private type field of the element.
     */
    connectedCallback () {
      if (this.hasAttribute('type')) {
        this.#img.src = `/images/${this.getAttribute('type')}/icon.png`
        this.#img.alt = this.getAttribute('type')
        this.#type = this.getAttribute('type')
      } else {
        throw new Error('type attribute is required')
      }
    }
  })
