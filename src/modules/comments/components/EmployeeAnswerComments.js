import React, { useState, useEffect } from 'react'
import {
  Box,
  MenuItem,
  TextField,
  Typography,
  Toolbar,
  Card,
  CardActions,
  CardContent,
  Snackbar,
} from '@material-ui/core/'
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

export default function EmployeeAnswerComments() {
  const classes = useStyles()

  const [years, setYears] = useState([])
  const [yearSelected, setYearSelected] = useState('')
  const [roundSelected, setRoundSelected] = useState('')
  const [answersForManager, setAnswersForManager] = useState([])
  const [loading, setLoading] = useState(false)

  const [disableRound, setDisableRound] = useState(true)

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

  const fetchAnswersWithManagerId = async (part) => {
    await axios
      .get(
        ASSESSMENT_URL +
          '/answer/comment/manager/' +
          yearSelected +
          '/' +
          part +
          '/' +
          USER.userid
      )
      .then((res) => {
        console.log(res.data)
        // setManagerList(res.data)
        mapAnswerGroup(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  const mapAnswerGroup = (data) => {
    var allAnswerGroup = []
    var answerGroup = []
    var lastUserid = ''

    var obj = {}

    for (var i = 0; i < data.length; i++) {
      if (i === 0) {
        lastUserid = data[i].userid
      }

      if (data[i].userid === lastUserid) {
        answerGroup.push(data[i])
        obj = {
          userid: data[i].userid,
          name: data[i].name,
          lastname: data[i].lastname,
          nickname: data[i].nickname,
          department: data[i].department,
          reveal: data[i].reveal,
          date: data[i].date,
          all_answer: answerGroup,
        }

        if (i === data.length - 1) {
          allAnswerGroup.push(obj)
        }
      } else {
        allAnswerGroup.push(obj)
        obj = {}
        answerGroup = []

        answerGroup.push(data[i])
        obj = {
          userid: data[i].userid,
          name: data[i].name,
          lastname: data[i].lastname,
          nickname: data[i].nickname,
          department: data[i].department,
          reveal: data[i].reveal,
          date: data[i].date,
          all_answer: answerGroup,
        }

        if (i === data.length - 1) {
          allAnswerGroup.push(obj)
        }
        lastUserid = data[i].userid
      }
    }
    setAnswersForManager(allAnswerGroup)
    console.log(allAnswerGroup)
  }

  const handleChangeYear = (event) => {
    setRoundSelected('')
    setAnswersForManager([])
    setYearSelected(event.target.value)
    setDisableRound(false)
  }

  const handleChangeRound = (event) => {
    setAnswersForManager([])
    setRoundSelected(event.target.value)
    fetchAnswersWithManagerId(event.target.value)
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
          ความคิดเห็นจากพนักงานในบริษัท ที่มีต่อท่าน
        </Typography>
        <Typography
          className={classes.fontKanit}
          variant="subtitle1"
          component="h3"
        >
          (พนักงานทุกแผนก ที่ฝากความคิดเห็นถึงท่าน)
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
        </div>
      </Box>

      <div className={classes.answersContent}>
        {answersForManager.length !== 0 ? (
          answersForManager.map((element, index) => (
            <Card key={index} className={classes.root} variant="outlined">
              <CardContent>
                {element.reveal ? (
                  <Typography style={{ color: 'red', fontFamily: 'Kanit' }}>
                    ไม่เปิดเผยชื่อ
                  </Typography>
                ) : (
                  <Typography style={{ color: 'blue', fontFamily: 'Kanit' }}>
                    {element.name} {element.lastname} ({element.nickname}) [
                    {element.department}]
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  style={{ color: 'gray', fontFamily: 'Kanit' }}
                >
                  {moment(element.date).format('LL')}
                </Typography>
              </CardContent>
              <CardContent>
                {element.all_answer.map((e, index) => (
                  <div key={index} style={{ margin: 4 }}>
                    <Typography className={classes.fontKanit} variant="body1">
                      {e.number}. {e.qt}
                    </Typography>
                    <Typography
                      className={classes.fontKanit}
                      variant="body2"
                      style={{
                        marginLeft: 18,
                        marginBottom: 14,
                        color: 'green',
                      }}
                    >
                      {e.answer}
                    </Typography>
                  </div>
                ))}

                {/* <TextField
                  id="filled-full-width"
                  style={{ marginBottom: 24 }}
                  inputProps={
                    ({ readOnly: true }, { style: { color: 'green' } })
                  }
                  multiline
                  fullWidth
                  value={element.answer}
                  variant="outlined"
                  // onChange={updateFieldChanged(index)}
                /> */}
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
              : roundSelected === ''
              ? 'ใส่ข้อมูลที่ต้องการค้นหาให้ครบ'
              : 'ไม่พบข้อมูล'}
          </Typography>
        )}
      </div>
    </div>
  )
}
