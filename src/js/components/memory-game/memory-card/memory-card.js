/**
 * @author Hampus Nilsson <hn222te@student.lnu.se>
 * @version 1.0.0
 */
const template = document.createElement('template')
template.innerHTML = `
    <style>
        img {
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
    <img/>
`

customElements.define('memory-card',
  /**
   * A custom element for a memory card.
   */
  class extends HTMLElement {
    /**
     * Image element containing the image of the backside or the character.
     */
    #img
    /**
     * Character available.
     */
    #characters
    /**
     * Current character chosen.
     */
    #character
    /**
     * Creates a new `memory-card` element.
     *
     * The constructor sets up the shadow DOM for the element, assigns some class properties,
     * and adds event listeners for clicking on cards using the keyboard.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#img = this.shadowRoot.querySelector('img')
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

    /**
     * Sets the character to be assigned to the card when flipped.
     *
     * @param {string} character - Name of the character.
     * @throws {Error} - If character doesn't exist.
     */
    set character (character) {
      if (this.#characters.includes(character)) {
        this.#character = character
      } else {
        throw new Error(`Bad character name. possible names are: ${this.#characters}`)
      }
    }

    /**
     * Getter for the character of the card.
     *
     * @returns {string} - Name of the character.
     */
    get character () {
      return this.#character
    }

    /**
     * Flips the card by setting the background image of the image element.
     *
     * @param {boolean} isFlipped - True is card is flipped.
     */
    #flipCard (isFlipped) {
      if (isFlipped) {
        this.#img.setAttribute('src', `./images/${this.#character}.png`)
        this.#img.setAttribute('alt', this.#character)
      } else {
        this.#img.setAttribute('src', './images/backside.png')
        this.#img.setAttribute('alt', 'backside')
      }
    }

    /**
     * An array of attributes to watch for changes.
     *
     * @returns {string[]} An array of attribute names.
     */
    static get observedAttributes () {
      return ['flipped']
    }

    /**
     * Handles changes to the `flipped` attribute of the `memory-card` element.
     *
     * @param {string} name The name of the attribute.
     * @param {string} oldValue The previous value of the attribute.
     * @param {string} newValue The new value of the attribute.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (this.hasAttribute('flipped')) {
        this.#img.toggleAttribute('flipped')
        this.#flipCard(true)
      } else {
        this.#img.toggleAttribute('flipped')
        this.#flipCard(false)
      }
    }

    /**
     * Executes when the `memory-card` element is added to the DOM.
     * Sets the default backside of the cards.
     *
     * @throws {Error} - If no character is set before connecting to the DOM.
     */
    connectedCallback () {
      if (!this.#character) {
        throw new Error(`A character must be set using memory-card.character(character) for the card to display. Possible characters: ${this.#characters}`)
      }
      this.#img.setAttribute('src', './images/backside.png')
      this.#img.setAttribute('alt', 'backside')
      this.setAttribute('tabindex', '0')
    }
  })
