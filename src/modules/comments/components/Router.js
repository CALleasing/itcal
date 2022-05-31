import React from 'react'

import { Routes, Route } from 'react-router-dom'
import EmployeeToManagerComments from './EmployeeToManagerComments'
import ManagerToEmployeeComments from './ManagerToEmployeeComments'
import EmployeeAnswerComments from './EmployeeAnswerComments'

export default function Router() {
  return (
    <Routes>
      <Route path="/emptomng" element={<EmployeeToManagerComments />}></Route>

      <Route path="/mngtoemp" element={<ManagerToEmployeeComments />}></Route>

      <Route path="/empans" element={<EmployeeAnswerComments />}></Route>
    </Routes>
  )
}
