/**
 * Get joke component.
 *
 * @author Hampus Nilsson <hn222te@student.lnu.se>
 * @version 1.0.0
 */
const template = document.createElement('template')
template.innerHTML = `
  <div>
    <p id="setup"></p>
    <p id="punchline"></p>
    <button>Another!</button>
  </div>
  <style>
    div {
      display: inline-block;
      background-color: white;
      height: min-content;
      width: 300px;
    }
    p {
      padding: 10px;
      font-family: 'Roboto', sans-serif;
      font-size: 24px;
    }

    button {
      margin: 10px;
      border: none;
      border-radius: 5px;
      padding: 10px;
      font-size: 24px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
  </style>
`
customElements.define('get-joke',
/**
 * A custom element that fetches and displays a joke from the official joke API.
 * The category of the joke can be changed using the 'category' attribute.
 */
  class extends HTMLElement {
    /**
     * The constructor for the get-joke custom element.
     * It attaches the shadow DOM to the element and adds an event listener to the button element that
     * fetches and renders a joke when clicked.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.shadowRoot.querySelector('button').addEventListener('click', async () => {
        const joke = await this.#fetchJoke(this.getAttribute('category'))
        this.#renderJoke(joke)
      })
    }

    /**
     * Fetches a joke from the official joke API based on the given category.
     * Disables the button while the fetch is in progress.
     *
     * @param {string} category - The category of the joke to fetch.
     * @returns {object} - A Promise that resolves with the joke object.
     */
    async #fetchJoke (category) {
      this.shadowRoot.querySelector('button').disabled = true
      const response = await fetch(`https://official-joke-api.appspot.com/jokes/${category}/random`)
      const jokeObject = await response.json()
      this.shadowRoot.querySelector('button').disabled = false
      return jokeObject[0]
    }

    /**
     * Renders the joke object in the shadow DOM.
     * Initially displays the setup with a loading indicator, and then displays the punchline.
     *
     * @param {object} jokeObject - The joke object to render.
     */
    #renderJoke (jokeObject) {
      const punchline = this.shadowRoot.querySelector('#punchline')
      punchline.textContent = ''
      const setup = this.shadowRoot.querySelector('#setup')
      setup.textContent = jokeObject.setup
      let count = 0
      const interval = setInterval(() => {
        punchline.textContent += '.'
        if (count === 3) {
          punchline.textContent = jokeObject.punchline
          count = 0
          clearInterval(interval)
        }
        count++
      }, 500)
      setTimeout(() => {
        punchline.textContent = jokeObject.punchline
      }, 2000)
    }

    /**
     * The callback function that is called when the element is inserted into the DOM.
     * If the `category` attribute is not set, it is defaulted to `programming`. Otherwise,
     * the element will fetch a joke from the specified category and render it.
     */
    async connectedCallback () {
      if (!this.hasAttribute('category')) {
        this.setAttribute('category', 'programming')
      } else {
        const joke = await this.#fetchJoke(this.getAttribute('category'))
        this.#renderJoke(joke)
      }
    }

    /**
     * A list of attribute names that the component should watch for changes to.
     *
     * @type {string[]}
     */
    static get observedAttributes () {
      return ['category']
    }

    /**
     * Callback function that is called when an observed attribute has been added, removed, or changed.
     * If the category attribute has changed and the new value is in the list of allowed categories,
     * the element will fetch a joke from the new category and render it.
     *
     * @param {string} name - The name of the attribute that has changed.
     * @param {string} oldValue - The old value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    async attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'category' && oldValue !== newValue) {
        if (this.options.category.includes(newValue)) {
          const joke = await this.#fetchJoke(newValue)
          this.#renderJoke(joke)
        }
      }
    }

    /**
     * Getter for the options object of the element.
     * The options object contains a list of allowed categories for the jokes.
     *
     * @returns {object} - The options object.
     */
    get options () {
      return {
        category: ['dad', 'programming', 'general', 'knock-knock']
      }
    }
  })
