import React from 'react'

import { Routes, Route } from 'react-router-dom'
import Maintenance from './Maintenance'

export default function Router() {
  return (
    <Routes>
      <Route path="/maintenance" element={<Maintenance />}></Route>
    </Routes>
  )
}
