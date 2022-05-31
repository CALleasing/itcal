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
  completed: {
    color: 'green',
  },
  notCompleted: {
    fontStyle: 'italic',
    color: 'red',
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

const department = [
  'ทุกสาขา',
  'การตลาดสาขามิตรภาพ',
  'การตลาดสาขาอุดรธานี 1',
  'ธุรการสินเชื่อ',
  'LC',
  'AR',
  'การตลาดสาขาพี่โชค',
  'การตลาดสาขาโนนทัน',
  'MD',
  'HR',
  'FN',
  'RE',
  'AM',
  'CO',
  'IT',
  'แม่บ้าน',
  'AD',
  'AC',
  'OP',
  'test2',
]

export default function PersonalAnswer() {
  const classes = useStyles()
  const [usersByDepartment, setUsersByDepartment] = useState([])
  const [allUserAssessments, setAllUserAssessments] = useState([])

  var users = []

  const [years, setYears] = useState([])
  const [yearSelected, setYearSelected] = useState('')
  const [roundSelected, setRoundSelected] = useState('')
  const [departmentSelected, setDepartmentSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [disableRound, setDisableRound] = useState(true)
  const [disableDepartment, setDisableDepartment] = useState(true)

  const [userSelected, setUserSelected] = useState('')
  const [disabledUsers, setDisableUsers] = useState(true)

  const [answers, setAnswers] = useState([])

  const [allUserCompany, setAllUserCompany] = useState([])

  const fetchAllUserCompany = async () => {
    axios
      .get(ASSESSMENT_URL + '/users')
      .then((res) => {
        console.log(res.data)
        setAllUserCompany(res.data)
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchUsersByDepartment = (value) => {
    setLoading(true)
    axios
      .get(ASSESSMENT_URL + '/users/department/' + value)
      .then((res) => {
        console.log(res.data)
        setUsersByDepartment(res.data)
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchAllquestion = async ({ year, part }) => {
    users = []
    setLoading(true)
    setAllUserAssessments([])
    await axios
      .get(ASSESSMENT_URL + '/question/staff/' + year + '/' + part)
      .then((res) => {
        fetchUsersComplete({ year, part, count: res.data.length })
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchUsersComplete = async ({ year, part, count }) => {
    users = []
    setAllUserAssessments([])
    await axios
      .get(ASSESSMENT_URL + '/users/' + year + '/' + part + '/' + count)
      .then((res) => {
        console.log(res.data)
        mapUsersComplete(res.data)
        // fetchUsersNotComplete({ year, part, count })
        //
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
          '/answer/staff/' +
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

  const mapUsersComplete = (value) => {
    users = []
    value.map((element) => {
      const result = {
        ...element,
        completed: 1,
      }
      users.push(result)
    })

    allUserCompany.map((e, index) => {
      let obj = users.find(
        (value) => value.userid.toLowerCase() === e.userid.toLowerCase()
      )
      console.log(obj)
      if (obj === undefined) {
        const result = {
          ...e,
          completed: 0,
        }
        users.push(result)
      }
    })

    setAllUserAssessments(
      users.sort((a, b) => a.department.localeCompare(b.department))
    )
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
    if (allUserCompany.length === 0) {
      fetchAllUserCompany()
    }
  }, [])

  const handleChangeYear = (event) => {
    setAnswers([])
    setRoundSelected('')
    setDepartmentSelected('')
    setUserSelected('')
    setYearSelected(event.target.value)
    setDisableRound(false)
    setDisableDepartment(true)
    setDisableUsers(true)
    setAllUserAssessments([])
    // setUserByDepartment([])
  }

  const handleChangeRound = (event) => {
    setAnswers([])
    setDepartmentSelected('')
    setUserSelected('')
    setRoundSelected(event.target.value)
    setAllUserAssessments([])
    setDisableDepartment(false)
    if (USER.department !== 'MD') {
      fetchUsersByDepartment(USER.department)
      setDisableUsers(false)
    } else {
      setDisableUsers(true)
    }
  }

  const handleDepartmentSelected = (event) => {
    setAnswers([])
    setUserSelected('')
    setUsersByDepartment([])
    setAllUserAssessments([])
    setDepartmentSelected(event.target.value)
    if (event.target.value !== 'ทุกสาขา') {
      fetchUsersByDepartment(event.target.value)
    } else {
      fetchAllquestion({ year: yearSelected, part: roundSelected })
    }
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
          คำตอบพนักงาน จากแบบประเมินพนักงาน
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
            id="outlined-select-currency"
            InputProps={{ style: { fontFamily: 'kanit' } }}
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
            id="outlined-select-currency"
            InputProps={{ style: { fontFamily: 'kanit' } }}
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

          {USER.department === 'MD' ? (
            <TextField
              InputProps={{ style: { fontFamily: 'kanit' } }}
              label="ค้นหาจากสาขา"
              id="outlined-select-currency"
              className={classes.textFiled}
              disabled={disableDepartment}
              variant="outlined"
              select
              value={departmentSelected}
              onChange={handleDepartmentSelected}
            >
              {department.map((e) => (
                <MenuItem className={classes.fontKanit} key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </TextField>
          ) : null}

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
            {departmentSelected !== 'ทุกสาขา'
              ? usersByDepartment.map((e, index) => (
                  <MenuItem
                    className={classes.fontKanit}
                    key={index}
                    value={e.userid}
                  >
                    {e.name} {e.lastname} ({e.nickname} {e.department})
                  </MenuItem>
                ))
              : allUserAssessments.map((e, index) =>
                  e.completed === 1 ? (
                    <MenuItem
                      className={classes.fontKanit}
                      key={index}
                      value={e.userid}
                      classes={{ root: classes.completed }}
                    >
                      {e.name} {e.lastname} ({e.nickname} {e.department})
                    </MenuItem>
                  ) : (
                    <MenuItem
                      className={classes.fontKanit}
                      key={index}
                      value={e.userid}
                      classes={{ root: classes.notCompleted }}
                    >
                      {e.name} {e.lastname} ({e.nickname} {e.department})
                      ไม่สมบูรณ์
                    </MenuItem>
                  )
                )}
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
                    { style: { color: 'green', fontFamily: 'Kanit' } })
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
