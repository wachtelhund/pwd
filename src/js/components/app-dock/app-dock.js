const template = document.createElement('template')
template.innerHTML = `
  <div>
    <slot></slot>
  </div>
  <style>
    slot {
      margin-left: 10px;
    }
    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      position: fixed;
      bottom: 5px;
      border-radius: 5px;
      height: 70px;
      width: 80%;
      margin-left: 10%;
      background-color: rgba(47, 47, 47, 0.95);
    }
  </style>
`
customElements.define('app-dock', class extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
})
