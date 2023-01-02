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
  class extends HTMLElement {
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.shadowRoot.querySelector('button').addEventListener('click', async () => {
        const joke = await this.#fetchJoke(this.getAttribute('category'))
        this.#renderJoke(joke)
      })
    }

    async #fetchJoke (category) {
      this.shadowRoot.querySelector('button').disabled = true
      const response = await fetch(`https://official-joke-api.appspot.com/jokes/${category}/random`)
      const jokeObject = await response.json()
      this.shadowRoot.querySelector('button').disabled = false
      return jokeObject[0]
    }

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

    async connectedCallback () {
      if (!this.hasAttribute('category')) {
        this.setAttribute('category', 'dad')
      } else {
        const joke = await this.#fetchJoke(this.getAttribute('category'))
        this.#renderJoke(joke)
      }
    }

    static get observedAttributes () {
      return ['category']
    }

    async attributeChangedCallback (name, oldValue, newValue) {
      console.log('changed');
      if (name === 'category' && oldValue !== newValue) {
        if (this.options.category.includes(newValue)) {
          console.log('hej');
          const joke = await this.#fetchJoke(newValue)
          this.#renderJoke(joke)
        }
      }
    }

    get options () {
      return {
        category: ['dad', 'programming', 'general', 'knock-knock']
      }
    }
  })
