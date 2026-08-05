import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}

function forceScrollTop() {
  window.scrollTo(0, 0)
}

// Chrome in particular can re-apply its own scroll restoration *asynchronously*,
// sometimes after the load event has already fired — so we force it at several
// different timing points to make sure nothing can override us afterward.
forceScrollTop()
window.addEventListener('load', () => {
  forceScrollTop()
  requestAnimationFrame(forceScrollTop)
  setTimeout(forceScrollTop, 0)
  setTimeout(forceScrollTop, 100)
  setTimeout(forceScrollTop, 300)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)