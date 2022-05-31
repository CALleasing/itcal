import React, { useState, useEffect } from 'react'
import {
  Box,
  MenuItem,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core/'
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import moment from 'moment'
import 'moment/locale/th'
import axios from 'axios'
import { ASSESSMENT_URL, USER } from 'modules/utils/variables'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  textFiled: {
    margin: theme.spacing(2),
  },
  questionContent: {
    marginTop: theme.spacing(4),
  },
  commentContent: {
    marginTop: theme.spacing(6),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    fontFamily: 'Kanit',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    fontFamily: 'Kanit',
  },
  fontKanit: {
    fontFamily: 'Kanit',
  },
}))

export default function ManagerToEmployeeAssessment() {
  const classes = useStyles()

  const [years, setYears] = useState([])
  const [yearSelected, setYearSelected] = useState('')
  const [roundSelected, setRoundSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [userSelected, setUserSelected] = useState('')
  const [users, setUsers] = useState([])
  const [allComment, setAllComment] = useState([])

  const [userSelectedObj, setUserSelectedObj] = useState({})

  const [commentUser, setCommentUser] = useState({
    answer: '',
    reason: '',
    userid: '',
  })

  const [disableRound, setDisableRound] = useState(true)
  const [disableUser, setDisableUsers] = useState(true)

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

  useEffect(
    () => {
      renderYear()
      if (users.length === 0) {
        if (USER.position === 'admin' || USER.department === 'MD') {
          fetchUsersMD('IT')
        } else {
          fetchUsersByManagerDepartment()
        }
      }
      // setUsers([])
    },
    [commentUser],
    [allComment]
  )

  const fetchAllComments = async (part) => {
    setLoading(true)
    await axios
      .get(ASSESSMENT_URL + '/answer/assessment/' + yearSelected + '/' + part)
      .then((res) => {
        console.log(res.data)
        setAllComment(res.data)
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchUsersMD = async (department) => {
    setLoading(true)
    await axios
      .get(ASSESSMENT_URL + '/users/department/' + department)
      .then((res) => {
        console.log(res.data)

        if (department === 'IT') {
          fetchUsersMD('OP')
        } else if (department === 'OP') {
          fetchUsersMD('AD')
        }

        for (var i = 0; i < res.data.length; i++) {
          setUsers((pre) => [...pre, res.data[i]])
        }

        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchUsersByManagerDepartment = async () => {
    setLoading(true)
    await axios
      .get(ASSESSMENT_URL + '/users/department/' + USER.department)
      .then((res) => {
        console.log(res.data)
        setUsers(res.data)
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchAnswersByDepartment = async (part) => {
    setLoading(true)
    await axios
      .get(
        ASSESSMENT_URL +
          '/answer/assessment/' +
          yearSelected +
          '/' +
          part +
          '/department/' +
          USER.department
      )
      .then((res) => {
        console.log(res.data)
        setAllComment(res.data)
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchDataByUserId = async (employeeId) => {
    setCommentUser({
      answer: '',
      reason: '',
    })
    await axios
      .get(
        ASSESSMENT_URL +
          '/answer/assessment/' +
          yearSelected +
          '/' +
          roundSelected +
          '/manager/' +
          USER.userid +
          '/users/' +
          employeeId
      )
      .then((res) => {
        console.log(res.data)
        if (res.data?.length !== 0) {
          setCommentUser(res.data[0])
        }

        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const fetchSendAnswer = async (body) => {
    setLoading(true)
    await axios
      .post(
        ASSESSMENT_URL +
          '/answer/assessment/' +
          yearSelected +
          '/' +
          roundSelected,
        body
      )
      .then((res) => {
        alert('เพิ่มความคิดเห็นของท่านแล้ว')
        // fetchAnswersByDepartment(roundSelected)
        setCommentUser({
          answer: '',
          reason: '',
        })
        setUserSelected('')
        if (USER.department === 'MD') {
          fetchAllComments(roundSelected)
        } else {
          fetchAnswersByDepartment(roundSelected)
        }

        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  const handleChangeYear = (event) => {
    setAllComment([])
    setRoundSelected('')
    setUserSelected('')

    setYearSelected(event.target.value)
    setDisableRound(false)
    setDisableUsers(true)
  }

  const handleChangeRound = (event) => {
    setAllComment([])
    setRoundSelected(event.target.value)
    setUserSelected('')
    setDisableUsers(false)
    if (USER.department === 'MD') {
      fetchAllComments(event.target.value)
    } else {
      fetchAnswersByDepartment(event.target.value)
    }
  }

  const handleUserSelected = (event) => {
    setUserSelected(event.target.value)
    fetchDataByUserId(event.target.value)

    users.map((e) => {
      if (event.target.value === e.userid) {
        setUserSelectedObj(e)
        console.log(event.target.value, e)
      }
    })
    // fetchDataByUserId(event.target.value)
  }

  const handleRadioChange = (event) => {
    console.log(event.target.value)
    setCommentUser({ ...commentUser, answer: event.target.value })
    // console.log(commentUser)
  }

  const handleUpdateReason = (event) => {
    setCommentUser({ ...commentUser, reason: event.target.value })
    // console.log(commentUser)
  }

  const handlePostClick = () => {
    const dataSend = {
      userid: userSelectedObj.userid,
      name: userSelectedObj.name,
      lastname: userSelectedObj.lastname,
      nickname: userSelectedObj.nickname,
      answer: commentUser.answer,
      reason: commentUser.reason,
      department: userSelectedObj.department,
      date: moment().format('yyyy-MM-DD'),
      manager_id: USER.userid,
      manager_name: USER.name,
      manager_lastname: USER.lastname,
      manager_nickname: USER.nickname,
    }
    console.log('PRE SEND', dataSend)
    fetchSendAnswer(dataSend)
  }

  return (
    <div className={classes.root}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Typography className={classes.fontKanit} variant="h5" component="h3">
          แสดงความคิดเห็นต่อลูกทีมของท่าน
        </Typography>
        <Typography
          className={classes.fontKanit}
          variant="subtitle1"
          component="h3"
        >
          (ผู้บริหาร และ ผู้จัดการเท่านั้นที่จะเห็นคำตอบ)
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
          '& .MuiTextField-root': { m: 1, width: '40ch' },
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
          <TextField
            id="outlined-select-currency"
            InputProps={{ style: { fontFamily: 'kanit' } }}
            disabled={disableUser}
            className={classes.textFiled}
            select
            label="เลือกลูกทีมเพื่อแสดงความคิดเห็น"
            value={userSelected}
            variant="outlined"
            onChange={handleUserSelected}
            // helperText="เลือกปีประเมิน"
          >
            {users.map((e, index) => (
              <MenuItem
                className={classes.fontKanit}
                key={index}
                value={e.userid}
              >
                {e.name} {e.lastname} ({e.nickname} {e.department})
              </MenuItem>
            ))}
          </TextField>
        </div>
      </Box>

      {commentUser?.length !== 0 ? (
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                ถ้าหาก {userSelectedObj.name} {userSelectedObj.lastname} (
                {userSelectedObj.nickname}) ลาออก ท่านจะทำอย่างไร...
              </FormLabel>
              <RadioGroup
                label="answer"
                name="answer"
                value={commentUser?.answer}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="1. โน้มน้าวใจให้เขาอยู่ต่อ"
                  control={<Radio />}
                  label="1. โน้มน้าวใจให้เขาอยู่ต่อ"
                />
                <FormControlLabel
                  value="2. ไม่แน่ใจ (ปรับทัศนคติใหม่)"
                  control={<Radio />}
                  label="2. ไม่แน่ใจ (ปรับทัศนคติใหม่)"
                />
                <FormControlLabel
                  value="3. เฉยๆ (เดี๋ยวหาใหม่ก็ได้)"
                  control={<Radio />}
                  label="3. เฉยๆ (เดี๋ยวหาใหม่ก็ได้)"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="4. โล่งใจ"
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
          <CardContent>
            <TextField
              id="filled-full-width"
              style={{ marginBottom: 24 }}
              inputProps={{ style: { color: 'green', fontFamily: 'Kanit' } }}
              multiline
              fullWidth
              placeholder="เหตุผลเพราะว่าอะไร"
              value={commentUser?.reason}
              variant="outlined"
              onChange={handleUpdateReason}
            />
            <CardActions style={{ justifyContent: 'center', display: 'flex' }}>
              <Button
                className={classes.fontKanit}
                variant="outlined"
                size="medium"
                color="primary"
                onClick={handlePostClick}
              >
                โพสต์ความคิดเห็น
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      ) : null}

      <div className={classes.commentContent}>
        <Typography
          style={{
            fontFamily: 'Kanit',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
            fontWeight: 'bold',
          }}
        >
          ความคิดเห็นทั้งหมด
        </Typography>
        <div
          style={{ width: '100%', flexDirection: 'column', display: 'flex' }}
        >
          {allComment.map((e, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  {e.manager_name} {e.manager_lastname} ({e.manager_nickname})
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {e.name} {e.lastname} ({e.nickname})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className={classes.heading}>{e.answer}</Typography>
                <Typography className={classes.secondaryHeading}>
                  {e.reason}
                </Typography>
                {/* <IconButton aria-label="delete" style={{ marginLeft: 8 }}>
                  <DeleteIcon />
                </IconButton> */}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  )
}
