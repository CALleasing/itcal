import React from 'react'
import {
  Toolbar,
  Typography,
  Container,
  Snackbar,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Routers from './Routers'

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(6, 2),
  },
}))

export default function Content() {
  const classes = useStyles()
  return (
    <main className={classes.content}>
      <Container maxWidth="lg">
        {/* <Toolbar></Toolbar>ห */}
        <Routers></Routers>
      </Container>
    </main>
  )
}
