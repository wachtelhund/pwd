import './components/memory-game/'
import './components/comp-container/'
import './components/app-dock/'
import './components/launcher-icon/'
import './components/get-joke/'
import './components/chat-app/'
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

/**
 * Launch the application.
 */
function main () {
  const body = document.querySelector('body')
  const dock = document.createElement('app-dock')
  const memoryLauncher = document.createElement('launcher-icon')
  const jokeLauncher = document.createElement('launcher-icon')
  const chatLauncher = document.createElement('launcher-icon')
  memoryLauncher.setAttribute('type', 'memory-game')
  jokeLauncher.setAttribute('type', 'get-joke')
  chatLauncher.setAttribute('type', 'chat-app')
  dock.appendChild(memoryLauncher)
  dock.appendChild(jokeLauncher)
  dock.appendChild(chatLauncher)
  body.appendChild(dock)
}

main()
