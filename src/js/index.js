import './components/memory-game/'
import './components/comp-container/'
/**
 * The main script file of the application.
 *
 * @author Hampus Nilsson <hn222te@student.lnu.se>
 * @version 1.0.0
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const register = await navigator.serviceWorker.register('../sw.js')
      console.log('SW: Service worker registered at: ', register.scope)
    } catch (error) {
      console.log('SW: Service worker registration failed: ', error)
    }
  })
}
const body = document.querySelector('body')
const game = document.createElement('memory-game')
game.setAttribute('size', 'lg')
const container = document.createElement('comp-container')
container.appendChild(game)
body.appendChild(container)
