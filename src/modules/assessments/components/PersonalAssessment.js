import React, { useState, useEffect } from 'react'
import {
  Box,
  MenuItem,
  TextField,
  Typography,
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

export default function PersonalAssessment() {
  const classes = useStyles()

  const [years, setYears] = useState([])
  const [yearSelected, setYearSelected] = useState('')
  const [roundSelected, setRoundSelected] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const [disableRound, setDisableRound] = useState(true)

  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [titleSnackBar, setTitleSnackBar] = useState('')

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

  const fetchAssessment = async ({ year, part }) => {
    // console.log(yearSelected, roundSelected)
    setLoading(true)
    await axios
      .get(
        ASSESSMENT_URL +
          '/answer/staff/' +
          year +
          '/' +
          part +
          '/' +
          USER.userid
      )
      .then((res) => {
        console.log(res.data)
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  const fetchSendAnswer = async ({ number, body }) => {
    // console.log(yearSelected, roundSelected)
    setLoading(true)
    await axios
      .post(
        ASSESSMENT_URL +
          '/answer/staff/' +
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
        // alert('ส่งคำตอบช้อ ' + number + ' แล้ว')
        // setData(res.data)
        setTitleSnackBar('ส่งคำตอบข้อ ' + number + ' แล้ว')
        setOpenSnackBar(true)
        setLoading(false)
      })
      .catch((err) => {
        alert.log(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    renderYear()
    // fetchAssessment()
  }, [data])

  const handleChangeYear = (event) => {
    setRoundSelected('')
    setData([])
    setYearSelected(event.target.value)
    setDisableRound(false)
  }

  const handleChangeRound = (event) => {
    setData([])
    setRoundSelected(event.target.value)
    fetchAssessment({ year: yearSelected, part: event.target.value })
  }

  const updateFieldChanged = (index) => (event) => {
    let newArr = [...data] // copying the old datas array
    newArr[index].answer = event.target.value // replace e.target.value with whatever you want to change it to
    setData(newArr)

    // console.log(data)
  }

  const handleClickSend = (index) => (event) => {
    // console.log(data[index])
    const result = data[index]?.answer
    console.log(result)
    if (result !== undefined && result !== null && result !== '') {
      const answer = {
        userid: USER.userid,
        answer: data[index].answer,
        year: data[index].year,
        part: data[index].part,
        number: data[index].number,
        // videoURL: '',
        date: moment(new Date()).format('yyyy-MM-DD'),
      }
      fetchSendAnswer({ number: data[index].number, body: answer })
    } else {
      alert('คำตอบต้องไม่ว่าง')
    }
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
          ประเมินตนเองในครึ่งปีที่ผ่านมา
        </Typography>
        <Typography
          className={classes.fontKanit}
          variant="subtitle1"
          component="h3"
        >
          (ผู้บริหาร และ ผู้จัดการสาขาท่านเท่านั้นที่จะเห็นคำตอบ)
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
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined-select-currency"
            className={classes.textFiled}
            InputProps={{ style: { fontFamily: 'kanit' } }}
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
            className={classes.textFiled}
            InputProps={{ style: { fontFamily: 'kanit' } }}
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

      <div className={classes.questionContent}>
        {data.length !== 0 ? (
          data.map((element, index) => (
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
                      InputProps={{
                        style: { fontFamily: 'kanit', color: 'green' },
                      }}
                      id="filled-full-width"
                      multiline
                      fullWidth
                      placeholder="เพิ่มคำตอบ"
                      value={element.answer}
                      variant="outlined"
                      onChange={updateFieldChanged(index)}
                    />
                  </Grid>
                  <Grid
                    style={{ justifyContent: 'center', display: 'flex' }}
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
          ))
        ) : (
          <Typography
            className={classes.fontKanit}
            style={{ justifyContent: 'center', display: 'flex' }}
          >
            {loading
              ? 'กำลังโหลดข้อมูล ...'
              : roundSelected === ''
              ? 'เลือกปี และครั้งที่ต้องการประเมิน'
              : 'ไม่พบข้อมูล'}
          </Typography>
        )}
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackBar(false)}
        message={titleSnackBar}
      />
    </div>
  )
}
