import React, { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const Chatbot = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const handleChat = async () => {
    if (!input.trim()) return

    const userMsg = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    try {
      const username = localStorage.getItem('username') || "Anonymous"
      const res = await axios.post('http://localhost:5000/chat', {
        ingredients: input,
        username: username,
      })

      const botMsg = { sender: 'bot', text: res.data.response }
      setMessages(prev => [...prev, botMsg])
    } catch (error) {
      console.error("Chat error:", error.response?.data || error.message)
      const errorMsg = {
        sender: 'bot',
        text: '❌ Error generating response. Please try again.',
      }
      setMessages(prev => [...prev, errorMsg])
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-orange-300 max-w-3xl mx-auto">
      {/* Chat Window */}
      <div className="h-[400px] overflow-y-auto flex flex-col gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-3 rounded-xl ${
              msg.sender === 'user'
                ? 'self-end bg-orange-500 text-white'
                : 'self-start bg-gray-100 text-gray-900'
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter ingredients like potato, rice..."
          className="flex-1 px-4 py-3 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleChat()}
        />
        <button
          onClick={handleChat}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg transition"
        >
          Ask 🍽️
        </button>
      </div>
    </div>
  )
}

export default Chatbot
