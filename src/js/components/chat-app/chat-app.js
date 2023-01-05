const template = document.createElement('template')
template.innerHTML = `
  <div id="root">
    <form id="username">
      <input type="text" name="username" placeholder="Username">
      <button type="submit">Set username</button>
    </form>
    <div id="chat">
    </div>
    <form id="message">
      <textarea maxlength="120" id="messagebox" name="message" placeholder="Message" rows="3"></textarea>
      <button type="submit">Send</button>
    </form>
  </div>
  <style>
    #chat {
      background: linear-gradient(135deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 79%, 1) 96%);
      width: 300px;
      height: 300px;
      border-radius: 5px;
      margin: 10px;
      padding: 5px;
      overflow: auto;
    }
    #message, #username {
      display: flex;
      justify-content: center;
    }
    #message>textarea, #username>input {
      position: relative;
      margin: 10px;
      width: 90%;
      bottom: 0;
      resize: none;
    }
    #message>button, #username>button {
      margin: 10px;
      border: none;
      border-radius: 5px;
      padding: 10px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
    button, select:hover {
      transform: scale(1.05);
    }
    button, select:active {
      transform: scale(0.95);
    }

    #chat p {
      word-break: break-all;
      display: block;
      margin: 0px;
    }

    #chat .self, #chat .other {
      width: 80%;
      margin: 5px;
      padding: 5px;
      border-radius: 5px;
    }

    .self {
      background: linear-gradient(135deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%);
      text-align: left;
      float: left;
    }

    .other {
      background: linear-gradient(45deg, hsla(186, 100%, 69%, 1) 0%, hsla(217, 100%, 50%, 1) 100%);
      text-align: right;
      color: black;
      float: right;
    }

    .username {
      margin: 0px;
      padding: 0px;
    }
    
    .notification {
      width: 100%;
      height: min-content;
      text-align: center;
    }
  </style>
`
customElements.define('chat-app',
  /**
   * Custom element for a chat app.
   *
   * Extends the HTMLElement class to create a custom element that can be used in HTML as a self-contained chat app.
   */
  class extends HTMLElement {
    /**
     * Indicates whether the last message received was sent by the current user.
     *
     * @type {boolean}
     */
    #isMe = false

    /**
     * The WebSocket connection.
     *
     * @type {WebSocket}
     */
    #socket

    /**
     * The name of the current chat channel.
     *
     * @type {string}
     */
    #channel

    /**
     * The chat window element.
     *
     * @type {HTMLElement}
     */
    #chat

    /**
     * The root element of the chat app.
     *
     * @type {HTMLElement}
     */
    #root

    /**
     * The current username.
     *
     * @type {string}
     */
    #username

    /**
     * The message key for the chat app.
     *
     * @type {string}
     */
    #MESSAGE_KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

    /**
     * Creates a new `chat-app` element.
     *
     * The constructor sets up the shadow DOM for the element, assigns some class properties,
     * and adds event listeners.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')
      this.#root = this.shadowRoot.querySelector('#root')
      this.#chat = this.shadowRoot.querySelector('#chat')
      this.#username = 'Guest'
      this.shadowRoot.querySelector('#messagebox').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          event.target.nextElementSibling.click()
        }
      })
      this.#root.addEventListener('submit', (event) => {
        event.preventDefault()
        if (event.target.id === 'username') {
          this.#username = event.target.username.value
          localStorage.removeItem('username')
          localStorage.setItem('username', this.#username)
          this.#checkForUsername()
        } else if (event.target.id === 'message') {
          if (event.target.message.value !== '') {
            this.#sendMessage(event)
          }
        }
      })
      this.#socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
          if ((this.#channel === 'broadcast' && !data.channel) || this.#channel === data.channel) {
            this.#receiveMessage(data)
          }
        }
      })
    }

    /**
     * Appends a new message to the chat window.
     *
     * @param {object} data - The message data.
     */
    #receiveMessage (data) {
      const messageP = document.createElement('p')
      const name = document.createElement('h4')
      const fullMessage = document.createElement('div')
      name.classList.add('username')
      name.textContent = data.username
      messageP.textContent = data.data
      if (this.#isMe === true) {
        this.#isMe = false
        fullMessage.classList.add('self')
      } else {
        fullMessage.classList.add('other')
      }
      fullMessage.appendChild(name)
      fullMessage.appendChild(messageP)
      this.#chat.appendChild(fullMessage)
    }

    /**
     * Sends a message over the WebSocket connection.
     *
     * @param {Event} event - The form submission event.
     */
    #sendMessage (event) {
      const message = {
        type: 'message',
        data: event.target.message.value,
        username: this.#username,
        channel: this.#channel,
        key: this.#MESSAGE_KEY
      }
      if (this.#channel !== 'broadcast') {
        message.channel = this.#channel
      } else {
        delete message.channel
      }
      event.target.message.value = ''
      this.#isMe = true
      this.#socket.send(JSON.stringify(message))
    }

    /**
     * Checks for a stored username in local storage, and updates the chat UI accordingly.
     *
     * @returns {boolean} - A boolean indicating whether a stored username was found.
     */
    #checkForUsername () {
      const username = localStorage.getItem('username')
      if (username) {
        this.#username = username
        this.shadowRoot.querySelector('#messagebox').nextElementSibling.disabled = false
        this.shadowRoot.querySelector('#messagebox').setAttribute('placeholder', 'Enter your message here.')
        this.shadowRoot.querySelector('#username').style.display = 'none'
        return true
      }
      this.shadowRoot.querySelector('#messagebox').nextElementSibling.disabled = true
      this.shadowRoot.querySelector('#messagebox').setAttribute('placeholder', 'Please enter a username before entering the chat.')
      return false
    }

    /**
     * Getter for available chat channels.
     *
     * @returns {object} - An object with an array of channel names.
     */
    get options () {
      return {
        channel: ['broadcast', 'study', 'gaming']
      }
    }

    /**
     * Getter for the list of attributes to be observed for changes.
     *
     * @returns {string[]} - An array of attribute names.
     */
    static get observedAttributes () {
      return ['channel']
    }

    /**
     * Callback function that is called whenever an observed attribute changes.
     *
     * @param {string} name - The name of the attribute that changed.
     * @param {string} oldValue - The previous value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'channel' && this.options.channel.includes(newValue) && newValue !== oldValue) {
        this.#channel = newValue
        const div = document.createElement('div')
        div.classList.add('notification')
        div.textContent = `Entered ${newValue} channel.`
        this.#chat.appendChild(div)
      }
    }

    /**
     * Callback function that is called when the element is inserted into the DOM.
     *
     * Performs initial setup for the chat app, including checking for a stored username and setting the default channel.
     */
    connectedCallback () {
      this.#checkForUsername()
      this.#channel = this.getAttribute('channel') || 'broadcast'
      this.setAttribute('channel', 'all')
    }

    /**
     * Callback function that is called when the element is removed from the DOM.
     *
     * Closes the WebSocket connection.
     */
    disconnectedCallback () {
      this.#socket.close()
    }
  })
