import React, { useState } from 'react'
import Chatbot from './Chatbot'
import Planner from './Planner'

export default function Dashboard({ user, onLogout }) {
  const [showPlanner, setShowPlanner] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold">Hello, {user.name || user.email}</div>
        <button
          onClick={onLogout}
          className="text-red-500 hover:underline"
        >
          Logout
        </button>
      </header>

      <Chatbot />

      <button
        onClick={() => setShowPlanner(prev => !prev)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full shadow-xl transition z-50"
      >
        {showPlanner ? '❌ Close Planner' : '📅 Weekly Planner'}
      </button>

      <div
        className={`fixed top-0 right-0 w-full md:w-[500px] h-full bg-white border-l border-orange-300 shadow-xl transform transition-transform duration-500 z-40 ${
          showPlanner ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 overflow-y-auto h-full">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">📆 Weekly Meal Planner</h2>
          <Planner />
        </div>
      </div>
    </div>
  )
}
