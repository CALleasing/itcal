import React from 'react'
import { Routes, Route, useNavigate, Link as RouteLink } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Drawer,
  Collapse,
  AppBar,
  Link,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ClickAwayListener,
} from '@material-ui/core'
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  ExitToApp as LogoutIcon,
  Assessment as AssessmentIcon,
  Build as BuildIcon,
  ExpandMore,
  ExpandLess,
  Person as PersonIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  HowToReg as HowToRegIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Feedback as FeedbackIcon,
  HowToVote as HowToVoteIcon,
} from '@material-ui/icons'

import logo from 'assets/images/CAL-round-Logo-512x512.png'
import Content from './Content'
import { USER } from 'modules/utils/variables'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  logoImage: {
    // marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    width: 50,
    height: 50,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuFooter: {
    alignSelf: 'center',
    margin: theme.spacing(4, 0),
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'kanit',
  },
  listItemText: {
    fontFamily: 'Kanit',
    fontSize: 15,
    fontWeight: 'bold',
  },
  subListItemText: { fontFamily: 'Kanit', fontSize: 14 },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  itemLoguot: {
    color: 'red',
  },
}))

export default function Header() {
  const navigate = useNavigate()
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const [openListAssessments, setOpenListAssessments] = React.useState(false)
  const [openListManager, setOpenListManager] = React.useState(false)

  const handleClickAssessmentMenu = () => {
    setOpenListAssessments(!openListAssessments)
  }

  const handleClickManagerMenu = () => {
    setOpenListManager(!openListManager)
  }

  const handleLogOut = () => {
    localStorage.removeItem('user')
    navigate('/itcal')
    window.location.reload(false)
  }

  return (
    <>
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Link
              component={RouteLink}
              style={{
                flexDirection: 'row',
                display: 'flex',
                alignItems: 'center',
              }}
              to="itcal/"
              color="inherit"
              underline="none"
            >
              <img
                className={classes.logoImage}
                src={logo}
                alt="CAL LEASING"
                sizes={50}
              />
              <Typography
                variant="h6"
                style={{ color: '#FFFF', fontFamily: 'Kanit' }}
              >
                CAL Internal Management
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>

        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={() => open && setOpen(false)}
        >
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <Typography
                style={{ fontFamily: 'Kanit', marginLeft: 8, color: 'green' }}
                variant="subtitle2"
                // component="caption"
              >
                {USER.name} {USER.lastname} ({USER.department})
              </Typography>
              <IconButton onClick={handleDrawerToggle}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>

            <Divider />
            <List>
              <ListItem button key={1} component={RouteLink} to="itcal/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="หน้าแรก"
                />
              </ListItem>

              <ListItem button key={2} onClick={handleClickAssessmentMenu}>
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="แบบประเมิน"
                />
                {openListAssessments ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openListAssessments} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    key={21}
                    className={classes.nested}
                    component={RouteLink}
                    to="itcal/assessments/personal"
                  >
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.subListItemText }}
                      primary="ประเมินตนเอง"
                    />
                  </ListItem>

                  <ListItem
                    button
                    key={22}
                    className={classes.nested}
                    component={RouteLink}
                    to="itcal/assessments/team"
                  >
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.subListItemText }}
                      primary={'ประเมินทีม'}
                    />
                  </ListItem>

                  <ListItem
                    button
                    key={23}
                    className={classes.nested}
                    component={RouteLink}
                    to="itcal/comments/emptomng"
                  >
                    <ListItemIcon>
                      <ChatIcon />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.subListItemText }}
                      primary="ฝากความเห็นถึง ผจก."
                    />
                  </ListItem>
                </List>
              </Collapse>

              {USER.position === 'ผู้จัดการ' || USER.position === 'admin' ? (
                <ListItem button key={3} onClick={handleClickManagerMenu}>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="ผู้จัดการ"
                  />
                  {openListManager ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              ) : (
                <ListItem button key={3} disabled>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="ผู้จัดการ"
                  />
                  {/* {openListManager ? <ExpandLess /> : <ExpandMore />} */}
                </ListItem>
              )}

              <Collapse in={openListManager} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    key={31}
                    className={classes.nested}
                    component={RouteLink}
                    to="itcal/answers/personal"
                  >
                    <ListItemIcon>
                      <HowToRegIcon />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.subListItemText }}
                      primary="ดูแบบประเมินพนักงาน"
                    />
                  </ListItem>

                  {USER.department !== 'MD' ? (
                    <ListItem
                      button
                      key={32}
                      className={classes.nested}
                      component={RouteLink}
                      to="itcal/answers/team"
                    >
                      <ListItemIcon>
                        <AssignmentTurnedInIcon />
                      </ListItemIcon>
                      <ListItemText
                        classes={{ primary: classes.subListItemText }}
                        primary="ดูแบบประเมินทีม"
                      />
                    </ListItem>
                  ) : (
                    <ListItem
                      disabled
                      button
                      key={32}
                      className={classes.nested}
                    >
                      <ListItemIcon>
                        <AssignmentTurnedInIcon />
                      </ListItemIcon>
                      <ListItemText
                        classes={{ primary: classes.subListItemText }}
                        primary="ดูแบบประเมินทีม"
                      />
                    </ListItem>
                  )}

                  <ListItem
                    button
                    key={33}
                    className={classes.nested}
                    component={RouteLink}
                    to="itcal/comments/empans"
                  >
                    <ListItemIcon>
                      <HowToVoteIcon />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.subListItemText }}
                      primary="ความคิดเห็นจากพนักงาน ถึงท่าน"
                    />
                  </ListItem>

                  <ListItem
                    button
                    key={34}
                    className={classes.nested}
                    component={RouteLink}
                    to="itcal/comments/mngtoemp"
                  >
                    <ListItemIcon>
                      <FeedbackIcon />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.subListItemText }}
                      primary="ความคิดเห็นจากท่าน ถึงลูกทีม"
                    />
                  </ListItem>

                  {/* <ListItem
                    button
                    key={32}
                    className={classes.nested}
                    component={RouteLink}
                    to="/CAL_IT_Management/assessments/manager"
                  >
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography style={{ fontSize: 14 }}>
                          ประเมินทีม
                        </Typography>
                      }
                    />
                  </ListItem> */}

                  {/* <ListItem
                    button
                    key={33}
                    className={classes.nested}
                    component={RouteLink}
                    to="/CAL_IT_Management/comments/personal"
                  >
                    <ListItemIcon>
                      <ChatIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography style={{ fontSize: 14 }}>
                          ความเห็นถึง ผจก.
                        </Typography>
                      }
                    />
                  </ListItem> */}
                </List>
              </Collapse>

              <ListItem
                button
                key={4}
                component={RouteLink}
                to="itcal/supports/maintenance"
              >
                <ListItemIcon>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="แจ้งปัญหา IT"
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button key={1} color="secondary" onClick={handleLogOut}>
                <ListItemIcon>
                  <LogoutIcon className={classes.itemLoguot} />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="ออกจากระบบ"
                  className={classes.itemLoguot}
                />
              </ListItem>
              <Divider />
            </List>
            {/* <Typography className={classes.menuFooter}></Typography> */}
            <Typography className={classes.menuFooter}>
              Created by DRIFT Dev@IT-CAL
            </Typography>
          </Drawer>
        </ClickAwayListener>

        <Routes>
          <Route
            // exact
            path="itcal/assessments/*"
            element={<Content />}
          />
          <Route
            // exact
            path="itcal/answers/*"
            element={<Content />}
          />

          <Route
            // exact
            path="itcal/comments/*"
            element={<Content />}
          />

          <Route
            // exact
            path="itcal/supports/*"
            element={<Content />}
          />

          <Route path="itcal/*" element={<Content />} />
        </Routes>
      </div>
    </>
  )
}
