const template = document.createElement('template')
template.innerHTML = `
    <style>
        span {
            display: inline-block;
            width: 150px;
            height: 150px;
            margin: 5px;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            border-radius: 5px;
            background-size: contain;
            transition: 200ms all ease-out;
        }
        [flipped] {
          transform: rotateY(180deg);
        }

    </style>
    <span tabindex="0"></span>
`

customElements.define('memory-card',
  class extends HTMLElement {
    #rootSpan
    #characters
    #character
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#rootSpan = this.shadowRoot.querySelector('span')
      this.#characters = [
        'backside',
        'hero',
        'kirby',
        'mario',
        'megaman',
        'pacman',
        'pirahnaplant',
        'wolf',
        'yoshi'
      ]
      this.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.click()
        }
      })
    }

    set character (character) {
      if (this.#characters.includes(character)) {
        this.#character = character
      } else {
        throw new Error(`Bad character name. possible names are: ${this.#characters}`)
        // What if someone chooses a bad name?
      }
    }

    get character () {
      return this.#character
    }

    #flipCard(isFlipped) {
      if (isFlipped) {
        this.#rootSpan.style.backgroundImage = `url('../../../../images/${this.#character}.png')`
      } else {
        this.#rootSpan.style.backgroundImage = "url('../../../../images/backside.png')"
      }
    }

    static get observedAttributes () {
      return ['flipped']
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (this.hasAttribute('flipped')) {
        this.#rootSpan.toggleAttribute('flipped')
        this.#flipCard(true)
      } else {
        this.#rootSpan.toggleAttribute('flipped')
        this.#flipCard(false)
      }
    }

    connectedCallback () {
      if (!this.#character) {
        throw new Error(`A character must be set using memory-card.character(character) for the card to display. Possible characters: ${this.#characters}`)
      }
      this.#rootSpan.style.backgroundImage = "url('../../../../images/backside.png')"
    }
  })
