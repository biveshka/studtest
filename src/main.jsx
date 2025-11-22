import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './App.css' // ДОЛЖЕН БЫТЬ ПЕРВЫМ!
import './index.css' // ДОЛЖЕН БЫТЬ ВТОРЫМ!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)