import React, { useState } from 'react'
import Chatbot from './components/Chatbot'
import Planner from './components/Planner'
import './App.css'
const App = () => {
  const [showPlanner, setShowPlanner] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-200 p-6 relative overflow-x-hidden">
      <h1 className="text-4xl font-bold text-center mb-6 text-orange-700 font-[Figtree] drop-shadow">
        🍲 Welcome to <span className="text-orange-500">KitchenSakhi</span>
      </h1>

      <Chatbot />

      {/* Toggle Button */}
      <button
        onClick={() => setShowPlanner(prev => !prev)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full shadow-xl transition duration-300 z-50"
      >
        {showPlanner ? 'Close Planner' : 'Weekly Planner'}
      </button>

      {/* Slide-in Planner Panel */}
      <div
        className={`fixed top-0 right-0 w-full md:w-[500px] h-full bg-white border-l border-orange-300 shadow-xl transition-transform duration-500 ease-in-out z-40 ${
          showPlanner ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">📆 Weekly Meal Planner</h2>
          <Planner />
        </div>
      </div>
    </div>
  )
}

export default App
