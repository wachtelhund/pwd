import './components/memory-game/'
import './components/comp-container/'
import './components/app-dock/'
import './components/launcher-icon/'
import './components/get-joke/'
import './components/desktop-comp/'
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
const container = document.createElement('comp-container')
container.appendChild(game)
const dock = document.createElement('app-dock')
const launcher = document.createElement('launcher-icon')
const launcher2 = document.createElement('launcher-icon')
launcher.setAttribute('type', 'memory-game')
launcher2.setAttribute('type', 'get-joke')
dock.appendChild(launcher)
dock.appendChild(launcher2)
body.appendChild(container)
body.appendChild(dock)
