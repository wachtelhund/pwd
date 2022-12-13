import './memory-card/'
const template = document.createElement('template')
template.innerHTML = `
  <style>
    div {
      width: max(700px);
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
    }
    memory-card {
      transition: 200ms all;
    }
    .hidden {
      visibility: none;
    }
    .scaledown {
      transform: scale(0);
    }
  </style>
  <div id="cardcontainer"></div>
  <form>
    <button id="reset">Reset game</button>
  </form>
  <p id="attempts"></p>
`

customElements.define('memory-game',
  class extends HTMLElement {
    #attempts
    #cardContainer
    #characters
    #flippedCharacters = []
    #matchedCards = new Set()
    #waiting = false
    #attemptsP
    #activeCharacters
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#cardContainer = this.shadowRoot.querySelector('#cardcontainer')
      this.#attemptsP = this.shadowRoot.querySelector('#attempts')
      this.#characters = [
        'hero',
        'kirby',
        'mario',
        'megaman',
        'pacman',
        'pirahnaplant',
        'wolf',
        'yoshi'
      ]
      this.#cardContainer.addEventListener('click', (event) => {
        if (!this.#waiting) {
          if (event.target.tagName.toLowerCase() === 'memory-card') {
            this.#flipCard(event.target)
          }
        }
      })
      this.shadowRoot.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault()
        this.#resetGame()
        this.#resetCards()
      })
    }

    #findCardsByName (name) {
      const cards = this.shadowRoot.querySelectorAll('memory-card')
      const matchingCards = []
      for (const card of cards) {
        if (card.character === name) {
          matchingCards.push(card)
        }
      }
      return matchingCards
    }

    #flipCard (memoryCard) {
      if (!memoryCard.hasAttribute('flipped')) {
        memoryCard.toggleAttribute('flipped')
        this.#flippedCharacters.push(memoryCard.character)
      }
      if (this.#flippedCharacters.length > 1) {
        this.#attempts++
        if (this.#flippedCharacters[0] === memoryCard.character) {
          // Player guesses right.
          this.#matchedCards.add(memoryCard.character)
          const cardsToHide = this.#findCardsByName(Array.from(this.#matchedCards).pop())
          this.#waiting = true
          setTimeout(() => {
            for (const card of cardsToHide) {
              card.classList.toggle('scaledown')
            }
          }, 500)
          setTimeout(() => {
            for (const card of cardsToHide) {
              card.classList.toggle('hidden')
            }
            this.#flippedCharacters = []
            this.#waiting = false
          }, 700)
          this.#flippedCharacters = []
          if (this.#matchedCards.size === this.#activeCharacters.length) {
            // Executes when player wins the game.
          }
        } else {
          // Player guesses wrong.
          this.#waiting = true
          setTimeout(() => {
            for (const card of this.#flippedCharacters) {
              const foundCards = this.#findCardsByName(card)
              foundCards.map((card) => card.removeAttribute('flipped'))
            }
            this.#flippedCharacters = []
            this.#waiting = false
          }, 500)
        }
      }
      this.#attemptsP.textContent = this.#attempts
      console.log(this.#attempts);
    }

    #resetCards () {
      for (const card of this.#cardContainer.querySelectorAll('memory-card')) {
        card.removeAttribute('flipped')
      }
      this.#flippedCharacters = []
    }

    #resetGame () {
      this.#attempts = 0
      this.#attemptsP.textContent = 0
      this.#matchedCards.clear()
      while (this.#cardContainer.firstChild) {
        this.#cardContainer.removeChild(this.#cardContainer.firstChild)
      }
      const cards = []
      for (const character of this.#activeCharacters) {
        for (let i = 0; i < 2; i++) {
          const card = document.createElement('memory-card')
          card.character = character
          cards.push(card)
        }
      }
      cards.sort(() => Math.random() - 0.5)
      cards.sort(() => Math.random() - 0.5)
      const fragment = new DocumentFragment()
      cards.map((card) => fragment.appendChild(card))
      this.#cardContainer.appendChild(fragment)
    }

    connectedCallback () {
      if (!this.hasAttribute('size')) {
        this.setAttribute('size', 'md')
      }
      this.#resetGame()
    }

    static get observedAttributes () {
      return ['size']
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'size' && newValue !== oldValue) {
        let limit = 4
        switch (newValue) {
          case 'sm':
            limit = 2
            break
          case 'md':
            limit = 4
            break
          case 'lg':
            limit = 8
            break
          default:
            break
        }
        this.#activeCharacters = this.#characters.slice(0, limit)
      }
    }
  })