import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AgentProvider } from './context/AgentContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider>
      <App />
    </AgentProvider>
  </React.StrictMode>,
)