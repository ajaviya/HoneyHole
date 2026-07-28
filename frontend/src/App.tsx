import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import FishLog from './pages/FishLog'

function App() {
  const [userId, setUserId] = useState<string | null>(null)

  return (
    <Routes>
        <Route path="/" element={<Login onLogin={setUserId}/>} />
        <Route path="/log" element={<FishLog userId={userId}/>} />
    </Routes>
  )
}

export default App