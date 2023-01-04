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
      <textarea id="messagebox" name="message" placeholder="Message" rows="3"></textarea>
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

    #chat div {
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
  </style>
`
customElements.define('chat-app',
  class extends HTMLElement {
    #isMe = false
    #socket
    #channel
    #chat
    #root
    #username
    #MESSAGE_KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
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
        } else if (event.target.id === 'message') {
          if (event.target.message.value !== '') {
            this.#sendMessage(event)
          }
        }
      })
      this.#socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
          this.#receiveMessage(data)
        }
      })
    }

    #retrieveUsername () {
      const username = localStorage.getItem('username')
      if (username) {
        this.#username = username
        return true
      }
      return false
    }
    
    #storeUsername (username) {
      localStorage.setItem('username', username)
    }

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
      console.table(message)
      this.#isMe = true
      this.#socket.send(JSON.stringify(message))
    }

    get options () {
      return {
        channel: ['broadcast', 'study', 'gaming']
      }
    }

    static get observedAttributes () {
      return ['channel']
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'channel' && this.options.channel.includes(newValue) && newValue !== oldValue) {
        this.#channel = newValue
      }
    }

    connectedCallback () {
      if (!this.#retrieveUsername()) {
        this.shadowRoot.querySelector('#messagebox').nextElementSibling.disabled = true
        this.shadowRoot.querySelector('#messagebox').setAttribute('placeholder', 'Please enter a username before entering the chat.')
        console.log('no username found');
      } else {
        this.shadowRoot.querySelector('#messagebox').nextElementSibling.disabled = false
        this.shadowRoot.querySelector('#messagebox').setAttribute('placeholder', 'Enter your message here.')
      }
      this.#channel = this.getAttribute('channel') || 'broadcast'
      this.setAttribute('channel', 'all')
    }

    disconnectedCallback () {
      this.#socket.close()
    }
  })
