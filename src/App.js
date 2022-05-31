import React, { useEffect, useState } from 'react'

import { BrowserRouter as Router } from 'react-router-dom'
import Login from 'modules/ui/components/Login'
import Layout from './modules/ui/components/Layout'
import { USER } from 'modules/utils/variables'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const result = localStorage.getItem('user')
    if (result !== null) {
      const parse = JSON.parse(result)
      setUser(parse)
      USER.userid = parse.userid
      USER.position = parse.position
      USER.department = parse.department
      USER.name = parse.name
      USER.lastname = parse.lastname
      USER.nickname = parse.nickname
      USER.phone = parse.phone
      USER.email = parse.email
    } else setUser(null)
    console.log('USER', USER)
  }, [])

  if (!user) {
    return (
      <Router>
        <Login></Login>
      </Router>
    )
  }
  return (
    <Router>
      <Layout></Layout>
    </Router>
  )
}

export default App
