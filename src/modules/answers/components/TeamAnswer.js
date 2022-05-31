import React, { useState, useEffect } from 'react'
import {
  Box,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  Card,
  CardContent,
} from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'

import moment from 'moment'
import 'moment/locale/th'
import axios from 'axios'
import { ASSESSMENT_URL, USER } from 'modules/utils/variables'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  textFiled: {
    margin: theme.spacing(2),
  },
  questionContent: {
    marginTop: theme.spacing(4),
  },
  selected: {
    '&.Mui-selected': {
      backgroundColor: 'turquoise',
      color: 'white',
      fontWeight: 600,
    },
  },
  answersContent: {
    marginTop: theme.spacing(4),
  },
  fontKanit: {
    fontFamily: 'kanit',
  },
}))

export default function TeamAnswer() {
  const classes = useStyles()

  const [allUsers, setAllUsers] = useState([])

  const [years, setYears] = useState([])
  const [yearSelected, setYearSelected] = useState('')
  const [roundSelected, setRoundSelected] = useState('')

  const [loading, setLoading] = useState(false)
  const [disableRound, setDisableRound] = useState(true)

  const [userSelected, setUserSelected] = useState('')
  const [disabledUsers, setDisableUsers] = useState(true)

  const [answers, setAnswers] = useState([])

  const fetchUsersByDepartment = (value) => {
    setLoading(true)
    axios
      .get(ASSESSMENT_URL + '/users/department/' + value)
      .then((res) => {
        console.log(res.data)
        setAllUsers(res.data)
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchAnswers = async (userid) => {
    // console.log(yearSelected, roundSelected)
    setLoading(true)
    await axios
      .get(
        ASSESSMENT_URL +
          '/answer/manager/' +
          yearSelected +
          '/' +
          roundSelected +
          '/' +
          userid
      )
      .then((res) => {
        // console.log(res.data)
        setAnswers(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  let presentYear = new Date()
  let passedYear = new Date()

  const renderYear = () => {
    passedYear.setFullYear(2020)
    var allYear = []
    while (presentYear > passedYear) {
      allYear.push(presentYear.getFullYear())
      presentYear.setFullYear(presentYear.getFullYear() - 1)
    }
    setYears(allYear)
  }

  useEffect(() => {
    renderYear()
  }, [])

  const handleChangeYear = (event) => {
    setAnswers([])
    setRoundSelected('')
    setUserSelected('')
    setYearSelected(event.target.value)
    setDisableRound(false)
    setDisableUsers(true)
    // setUserByDepartment([])
    fetchUsersByDepartment(USER.department)
  }

  const handleChangeRound = (event) => {
    setAnswers([])
    setUserSelected('')
    setRoundSelected(event.target.value)

    setDisableUsers(false)
  }

  const handleUserSelected = (event) => {
    setAnswers([])
    setUserSelected(event.target.value)
    console.log(event.target.value)
    fetchAnswers(event.target.value)
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Typography className={classes.fontKanit} variant="h5" component="h3">
          คำตอบลูกทีม จากแบบประเมินทีม
        </Typography>
      </div>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'end',
        }}
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '30ch' },
        }}
        autoComplete="off"
      >
        <div>
          <TextField
            InputProps={{ style: { fontFamily: 'kanit' } }}
            id="outlined-select-currency"
            className={classes.textFiled}
            select
            label="ปีประเมิน"
            value={yearSelected}
            variant="outlined"
            onChange={handleChangeYear}
            // helperText="เลือกปีประเมิน"
          >
            {years.map((e) => (
              <MenuItem className={classes.fontKanit} key={e} value={e}>
                {e}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            InputProps={{ style: { fontFamily: 'kanit' } }}
            id="outlined-select-currency"
            className={classes.textFiled}
            disabled={disableRound}
            select
            label="ครั้งที่"
            value={roundSelected}
            variant="outlined"
            onChange={handleChangeRound}
            // helperText="เลือกครั้งที่"
          >
            <MenuItem className={classes.fontKanit} key={1} value={1}>
              ครั้งที่ 1 (เดือน 1-6)
            </MenuItem>
            <MenuItem className={classes.fontKanit} key={2} value={2}>
              ครั้งที่ 2 (เดือน 7-12)
            </MenuItem>
          </TextField>

          <TextField
            InputProps={{ style: { fontFamily: 'kanit' } }}
            id="outlined-select-currency"
            className={classes.textFiled}
            select
            label="เลือกพนักงาน"
            value={userSelected}
            variant="outlined"
            onChange={handleUserSelected}
            disabled={disabledUsers}
          >
            {allUsers.map((e, index) => (
              <MenuItem
                className={classes.fontKanit}
                key={index}
                value={e.userid}
                classes={{ root: classes.completed }}
              >
                {e.name} {e.lastname} ({e.nickname} {e.department})
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Box>

      <div className={classes.answersContent}>
        {answers.length !== 0 ? (
          answers.map((element, index) => (
            <Card key={index} className={classes.root} variant="outlined">
              <CardContent>
                <Typography className={classes.fontKanit}>
                  {element.number}. {element.qt}
                </Typography>
              </CardContent>
              <CardContent>
                <TextField
                  id="filled-full-width"
                  style={{ marginBottom: 24 }}
                  inputProps={
                    ({ readOnly: true },
                    { style: { fontFamily: 'Kanit', color: 'green' } })
                  }
                  multiline
                  fullWidth
                  value={element.answer}
                  variant="outlined"
                  // onChange={updateFieldChanged(index)}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            style={{
              fontFamily: 'Kanit',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            {loading
              ? 'กำลังโหลดข้อมูล ...'
              : userSelected === ''
              ? 'ใส่ข้อมูลที่ต้องการค้นหาให้ครบ'
              : 'ไม่พบข้อมูล'}
          </Typography>
        )}
      </div>
    </>
  )
}
