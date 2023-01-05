/**
 * @author Hampus Nilsson <hn222te@student.lnu.se>
 * @version 1.0.0
 */
import './memory-card/'
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #gameRoot {
      width: min-content;
    }
    #cardcontainer {
      width: 640px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
    }
    memory-card {
      transition: 200ms all;
    }
    .winner {
      background-image: url('./images/memory-game/winner.gif');
      background-size: cover;
      background-position: center;
      height: 400px;
    }
    .hidden {
      visibility: none;
    }
    .scaledown {
      transform: scale(0);
    }
    .spin {
      transform: rotate(360deg);
    }
    form {
      display: inline-block;
    }
    p {
      display: inline-block;
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
    button:active {
      transform: scale(0.98);
    }
    button>img {
      transition: 500ms all ease;
    }
  </style>
  <div id="gameRoot">
  <div id="cardcontainer"></div>
  <form>
    <button id="reset">Reset game <img id="reseticon" src="./images/memory-game/reset.png"/></button>
  </form>
  <p id="attempts"></p>
  <p id="timer"></p>
  </div>
`

customElements.define('memory-game',
  /**
   * A custom element for a memory game.
   */
  class extends HTMLElement {
    /**
     * Number of attempts used.
     */
    #attempts
    /**
     * Div element containing the memory cards generated.
     */
    #cardContainer
    /**
     * Characters available.
     */
    #characters
    /**
     * Cards that are currently flipped.
     */
    #flippedCharacters = []
    /**
     * Cards that have been matched.
     */
    #matchedCards = new Set()
    /**
     * Flag used to signal if the eventlistener for click should be ignored temporarily.
     */
    #waiting = false
    /**
     * Paragraph element showing the number of attempts.
     */
    #attemptsP
    /**
     * Active characters depending on the size of the game.
     */
    #activeCharacters
    /**
     * Creates a new `memory-game` element.
     *
     * The constructor sets up the shadow DOM for the element, assigns some class properties,
     * and adds event listeners for clicking on cards and resetting the game.
     */
    #interval
    /**
     * The constructor for the memory-game custom element.
     * It attaches the shadow DOM to the element, appends the template content to it,
     * and adds event listeners. It also sets up an array or possible characters.
     */
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
        const icon = this.shadowRoot.querySelector('#reseticon')
        icon.classList.toggle('spin')
        this.#resetGame()
      })
    }

    /**
     * Timer that tells use the time it took to complete the game.
     *
     * @returns {string} - Interval id that is used to clear the timer.
     */
    #timer () {
      const timer = this.shadowRoot.querySelector('#timer')
      timer.textContent = 'Time: 0'
      let time = 0
      const interval = setInterval(() => {
        time++
        timer.textContent = `Time: ${time}`
      }, 1000)
      return interval
    }

    /**
     * Returns possible sizing options for the game.
     *
     * @returns {object} An object with a `size` property that is an array of possible sizes.
     */
    get options () {
      return {
        size: ['sm', 'md', 'lg']
      }
    }

    /**
     * Returns an array of `memory-card` elements that have the specified character name.
     *
     * @param {string} name - The character name to search for.
     * @returns {HTMLElement[]} An array of matching `memory-card` elements.
     */
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

    /**
     * Flips a card and checks if it matches any other flipped cards.
     * Increments the number of attempts and updates the display.
     * Hides matching cards and if the player guesses right.
     * Resets card if player guesses wrong.
     *
     * @param {HTMLElement} memoryCard The card to flip.
     */
    #flipCard (memoryCard) {
      if (!memoryCard.hasAttribute('flipped')) {
        memoryCard.toggleAttribute('flipped')
        this.#flippedCharacters.push(memoryCard.character)
      }
      if (this.#flippedCharacters.length > 1) {
        this.#attempts++
        if (this.#flippedCharacters[0] === memoryCard.character) {
          this.#matchedCards.add(memoryCard.character)
          const cardsToHide = this.#findCardsByName(Array.from(this.#matchedCards).pop())
          this.#waiting = true
          setTimeout(() => {
            for (const card of cardsToHide) {
              card.removeAttribute('tabindex')
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
            setTimeout(() => {
              this.#cardContainer.classList.add('winner')
              new Audio('./images/memory-game/winner.mp3').play()
            }, 500)
            clearInterval(this.#interval)
            this.#attemptsP.textContent = `You won in ${this.#attempts} attempts!`
          }
        } else {
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
      if (!(this.#matchedCards.size === this.#activeCharacters.length)) {
        this.#attemptsP.textContent = `Number of attempts: ${this.#attempts}`
      }
    }

    /**
     * Resets the game by resetting the number of attempts, clearing the matched cards,
     * creating new cards, and shuffling the cards.
     */
    #resetGame () {
      this.#cardContainer.classList.remove('winner')
      if (this.#interval) {
        clearInterval(this.#interval)
      }
      this.shadowRoot.querySelector('#timer').textContent = ''
      this.#interval = this.#timer()
      this.#attempts = 0
      this.#attemptsP.textContent = 'Number of attempts: 0'
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

      for (let i = cards.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        ;[cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]]
      }

      const fragment = new DocumentFragment()
      cards.map((card) => fragment.appendChild(card))
      this.#cardContainer.appendChild(fragment)
    }

    /**
     * Executes when the `memory-game` element is added to the DOM.
     * Sets the default size of the game if the `size` attribute is not set and resets the game.
     */
    connectedCallback () {
      if (!this.hasAttribute('size')) {
        this.setAttribute('size', 'md')
      }
      this.#resetGame()
    }

    /**
     * An array of attributes to watch for changes.
     *
     * @returns {string[]} An array of attribute names.
     */
    static get observedAttributes () {
      return ['size']
    }

    /**
     * Handles changes to the `size` attribute of the `memory-game` element.
     *
     * @param {string} name The name of the attribute.
     * @param {string} oldValue The previous value of the attribute.
     * @param {string} newValue The new value of the attribute.
     */
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
        this.#resetGame()
      }
    }
  })
