import React from 'react'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Room from './pages/Room'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/notfound/:roomId" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
