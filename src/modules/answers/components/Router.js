import React from 'react'

import { Routes, Route } from 'react-router-dom'
import PersonalAnswer from './PersonalAnswer'
import TeamAnswer from './TeamAnswer'

export default function Router() {
  return (
    <Routes>
      <Route path="/personal" element={<PersonalAnswer />}></Route>

      <Route path="/team" element={<TeamAnswer />}></Route>
    </Routes>
  )
}
