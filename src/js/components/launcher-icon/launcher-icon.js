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
customElements.define('launcher-icon', class extends HTMLElement {
  #img
  #type
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
