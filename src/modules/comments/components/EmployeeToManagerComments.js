import React, { useState, useEffect } from 'react'
import {
  Box,
  MenuItem,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  Button,
  Snackbar,
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
  fontKanit: {
    fontFamily: 'kanit',
  },
}))

export default function EmployeeToManagerComments() {
  const classes = useStyles()

  const [years, setYears] = useState([])
  const [yearSelected, setYearSelected] = useState('')
  const [roundSelected, setRoundSelected] = useState('')
  const [managerList, setManagerList] = useState([])
  const [managerSelected, setManagerSelected] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const [disableRound, setDisableRound] = useState(true)
  const [disabledManagerList, setDisableManagerList] = useState(true)

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

  const fetchManagerList = async () => {
    await axios
      .get(ASSESSMENT_URL + '/users/position/ผู้จัดการ')
      .then((res) => {
        console.log(res.data)
        setManagerList(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  const fetchAllQuestionsWithAnswers = async (managerId) => {
    // console.log(yearSelected, roundSelected)
    setLoading(true)
    await axios
      .get(
        ASSESSMENT_URL +
          '/answer/comment/user/' +
          yearSelected +
          '/' +
          roundSelected +
          '/' +
          managerId +
          '/' +
          USER.userid
      )
      .then((res) => {
        console.log(res.data)
        console.log(res.data[0])
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].reveal === 1) {
            setCheck(true)
          }
        }

        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  const fetchSendAnswer = async ({ number, body }) => {
    console.log(number, body)
    setLoading(true)
    await axios
      .post(
        ASSESSMENT_URL +
          '/answer/comment/user/' +
          yearSelected +
          '/' +
          roundSelected +
          '/' +
          USER.userid +
          '/' +
          number,
        body
      )
      .then((res) => {
        alert('ส่งคำตอบของท่านแล้ว')
        setLoading(false)
      })
      .catch((err) => {
        alert(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    renderYear()
    fetchManagerList()
  }, [])

  const handleChangeYear = (event) => {
    setRoundSelected('')
    setManagerSelected('')
    setData([])
    setYearSelected(event.target.value)
    setDisableRound(false)
    setDisableManagerList(true)
  }

  const handleChangeRound = (event) => {
    setData([])
    setManagerSelected('')
    setRoundSelected(event.target.value)
    setDisableManagerList(false)
    // fetchAssessment({ year: yearSelected, part: event.target.value })
  }

  const handleManagerSelected = (event) => {
    setCheck(false)
    setData([])
    setManagerSelected(event.target.value)
    fetchAllQuestionsWithAnswers(event.target.value)
  }

  const [isCheck, setCheck] = useState(false)

  const handleChange = () => {
    setCheck(!isCheck)
  }

  const updateFieldChanged = (index) => (event) => {
    let newArr = [...data] // copying the old datas array
    newArr[index].answer = event.target.value // replace e.target.value with whatever you want to change it to
    setData(newArr)

    console.log(data)
  }

  const handleClickSend = (index) => (event) => {
    // console.log(data[index])
    const result = data[index]?.answer
    console.log(result)
    if (result !== undefined && result !== null && result !== '') {
      const answer = {
        answer: data[index].answer,
        department: USER.department,
        reveal: isCheck,
        manager_id: managerSelected,
        date: moment(new Date()).format('yyyy-MM-DD'),
      }
      fetchSendAnswer({ number: data[index].number, body: answer })
    } else {
      alert('คำตอบต้องไม่ว่าง')
    }
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
          ฝากความคิดเห็นถึง ผจก.
        </Typography>
        <Typography
          className={classes.fontKanit}
          variant="subtitle1"
          component="h3"
        >
          (ผู้จัดการที่ท่านเลือกเท่านั้นที่จะเห็นคำตอบ)
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
            InputProps={{
              style: { fontFamily: 'kanit', color: 'green' },
            }}
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
            InputProps={{
              style: { fontFamily: 'kanit', color: 'green' },
            }}
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
            InputProps={{
              style: { fontFamily: 'kanit', color: 'green' },
            }}
            id="outlined-select-currency"
            className={classes.textFiled}
            disabled={disabledManagerList}
            select
            label="เลือกผู้จัดการ"
            value={managerSelected}
            variant="outlined"
            onChange={handleManagerSelected}
            // helperText="เลือกปีประเมิน"
          >
            {managerList.map((e, index) => (
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

      <div className={classes.questionContent}>
        {data.length !== 0 ? (
          <div>
            <Typography className={classes.fontKanit}>
              ต้องการเปิดเผยชื่อให้ผู้จัดการทราบหรือไม่ (เลือกก่อนส่งคำตอบ)
            </Typography>
            <FormControlLabel
              style={{ marginBottom: 16 }}
              control={
                <Checkbox
                  checked={isCheck}
                  onChange={handleChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="ไม่เปิดเผยชื่อ"
            />

            {data.map((element, index) => (
              <Card key={index} className={classes.root} variant="outlined">
                <CardContent>
                  <Typography className={classes.fontKanit}>
                    {element.number}. {element.qt}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Grid
                    container
                    spacing={1}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 24,
                    }}
                  >
                    <Grid item xs={12} sm={10}>
                      <TextField
                        id="filled-full-width"
                        inputProps={{
                          style: { fontFamily: 'Kanit', color: 'green' },
                        }}
                        multiline
                        fullWidth
                        value={element.answer}
                        variant="outlined"
                        onChange={updateFieldChanged(index)}
                      />
                    </Grid>
                    <Grid
                      style={{ display: 'flex', justifyContent: 'center' }}
                      item
                      xs={12}
                      sm={2}
                    >
                      <Button
                        className={classes.fontKanit}
                        variant="contained"
                        color="primary"
                        onClick={handleClickSend(index)}
                      >
                        ส่งคำตอบ
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </div>
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
              : managerSelected === ''
              ? 'เลือกผู้จัดการที่ท่านอยากจะฝากความคิดเห็น'
              : 'ไม่พบข้อมูล'}
          </Typography>
        )}
      </div>
    </>
  )
}
