import './memory-card/'
const template = document.createElement('template')
template.innerHTML = `
  <style>
    div {
      width: max(630px);
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
    }
  </style>
  <div id="memoryroot"></div>
`

customElements.define('memory-game',
  class extends HTMLElement {
    #rootDiv
    #characters
    #flippedCharacters = []
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#rootDiv = this.shadowRoot.querySelector('#memoryroot')
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
      this.#rootDiv.addEventListener('click', (event) => {
        if (event.target.tagName.toLowerCase() === 'memory-card') {
          this.#flipCard(event.target)
        }
      })
    }

    #flipCard (memoryCard) {
      if (!memoryCard.hasAttribute('flipped')) {
        memoryCard.toggleAttribute('flipped')
        this.#flippedCharacters.push(memoryCard.character)
      }
      console.log(this.#flippedCharacters)
    }

    connectedCallback () {
      const cards = []
      for (const character of this.#characters) {
        for (let i = 0; i < 2; i++) {
          const card = document.createElement('memory-card')
          card.character = character
          cards.push(card)
        }
      }
      cards.sort(() => Math.random() - 0.5)
      const fragment = new DocumentFragment()
      cards.map((card) => fragment.appendChild(card))
      this.#rootDiv.appendChild(fragment)
    }
  })
