const template = document.createElement('template')
template.innerHTML = `
  <div>
    <slot></slot>
  </div>
`
customElements.define('desktop-comp',
  class extends HTMLElement {
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.addEventListener('focusin', (event) => {
        console.log('hejjjjjjjjj');
        if (event.target.tagName.toLowerCase() === 'comp-container') {
          this.#sortZIndex(event.target)
        }
      })
    }

    #sortZIndex (container) {
      const containers = this.querySelectorAll('comp-container')
      console.log('sorting');
      console.log(container);
      console.log(containers);
      containers.forEach((container) => {
        //container.style.zIndex = 0
      })
      //container.style.zIndex = 100
    }
  })
