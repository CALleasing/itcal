import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CssBaseline,
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CALLogo from 'assets/images/CAL-round-Logo-512x512.png'
import axios from 'axios'
import { ASSESSMENT_URL, USER } from 'modules/utils/variables'

function Copyright() {
  return (
    <Typography
      style={{ fontFamily: 'Kanit' }}
      variant="body2"
      color="textSecondary"
      align="center"
    >
      {'Copyright © CAL Leasing 2022'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontFamily: 'Kanit',
  },
  buttonProgress: {
    color: 'white',
  },
  fontKanit: {
    fontFamily: 'Kanit',
  },
}))

export default function Login() {
  const navigate = useNavigate()

  const [user, setUser] = useState({})
  const classes = useStyles()
  const [userid, setUserid] = useState()
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const logIn = async (credentials) => {
    setLoading(true)
    await axios
      .post(ASSESSMENT_URL + '/login', credentials)
      .then((res) => {
        console.log(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
        setUser(res.data)
        // alert(res.data)
        USER.userid = res.data.userid
        USER.position = res.data.position
        USER.department = res.data.department
        USER.name = res.data.name
        USER.lastname = res.data.lastname
        USER.nickname = res.data.nickname
        USER.phone = res.data.phone
        USER.email = res.data.email

        setFailed(false)
        navigate('/itcal')
        window.location.reload(false)
        // setLoading(false)
        // setTimeout(, 3000)
      })
      .catch((err) => {
        setLoading(false)
        setFailed(true)
        setPassword('')
        // alert(err)
      })
  }

  const handleSubmit = (event) => {
    console.log(userid)
    // event.preventDefaule()
    logIn({
      userid,
      password,
    })
  }

  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        component="main"
        className={classes.root}
      >
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar} src={`${CALLogo}`}></Avatar>
            <Typography
              className={classes.fontKanit}
              component="h1"
              variant="h5"
            >
              ระบบจัดการสำหรับพนักงาน CAL
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                InputProps={{ style: { fontFamily: 'Kanit' } }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="ชื่อผู้ใช้งาน"
                name="ีuser"
                value={userid}
                // autoComplete="username"
                autoFocus
                onChange={(e) => setUserid(e.target.value)}
              />
              <TextField
                InputProps={{ style: { fontFamily: 'Kanit' } }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="รหัสผ่าน"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit()
                    // write your functionality here
                  }
                }}
              />

              <Button
                loading={loading}
                fullWidth
                variant="contained"
                className={classes.submit}
                color="primary"
                onClick={handleSubmit}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </Button>
              {failed ? (
                <Typography
                  style={{
                    color: 'red',
                    justifyContent: 'center',
                    display: 'flex',
                  }}
                  component="content"
                  variant="content"
                >
                  ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง
                </Typography>
              ) : null}

              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </Container>
  )
}
