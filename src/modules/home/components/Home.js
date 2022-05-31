import React, { useEffect, useState } from 'react'
import { Typography, useMediaQuery } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import homeImage from 'assets/images/home.jpg'
import { USER } from 'modules/utils/variables'

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
  userDisplay: {
    fontFamily: 'kanit',
    color: 'green',
  },
  imageStyle: {
    marginTop: 50,
    marginBottom: 50,
  },
}))

export default function Home() {
  const classes = useStyles()

  //   const isMobile = useMediaQuery({ query: `(max-width: 760px)` })
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // margin: 200,
      }}
    >
      <Typography style={{ fontFamily: 'Kanit' }} variant="h5" component="h3">
        ระบบจัดการภายใน สำหรับพนักงาน CAL
      </Typography>
      <Typography className={classes.userDisplay} variant="h6" component="h3">
        สวัสดีคุณ {USER.name} {USER.lastname} ({USER.department})
      </Typography>

      <img
        src={homeImage}
        width="50%"
        height="50%"
        className={classes.imageStyle}
      />

      {/* <Typography
        className={classes.fontKanit}
        variant="subtitle1"
        component="h3"
      >
        (ผู้บริหาร และ ผู้จัดการสาขาท่านเท่านั้นที่จะเห็นคำตอบ)
      </Typography> */}
    </div>
  )
}
