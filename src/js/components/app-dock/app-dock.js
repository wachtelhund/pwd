/**
 * Application dock component.
 *
 * @author Hampus Nilsson <hn222te@student.lnu.se>
 * @version 1.0.0
 */
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
      z-index: 101;
    }
  </style>
`
/**
 * Custom element for a dock.
 *
 * Extends the HTMLElement class to create a custom element that can be used in HTML as a dock.
 */
customElements.define('app-dock',
  /**
   * Custom element for a dock.
   *
   * Extends the HTMLElement class to create a custom element that can be used in HTML as a dock.
   */
  class extends HTMLElement {
    /**
     * The constructor for the app-dock custom element.
     * It attaches the shadow DOM to the element and appends the template content to it.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  })
