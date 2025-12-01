import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './Store/Store.jsx'
registerSW()  
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
)
