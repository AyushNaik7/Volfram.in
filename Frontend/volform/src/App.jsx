import { useState } from 'react'
import './App.css'
import ChatWidget from './components/chatbot/ChatWidget'

function App() {
  console.log('App rendering...');
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f0f0f0' }}>
      <h1 style={{ padding: '20px' }}>Volfram Systems</h1>
      <ChatWidget />
    </div>
  )
}

export default App
