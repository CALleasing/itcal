import React from 'react'

import { Routes, Route } from 'react-router-dom'
import PersonalAssessment from './PersonalAssessment'
import TeamAssessment from './TeamAssessment'

export default function Router() {
  return (
    <Routes>
      <Route path="/personal" element={<PersonalAssessment />}></Route>

      <Route path="/team" element={<TeamAssessment />}></Route>
    </Routes>
  )
}
