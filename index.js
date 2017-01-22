const bodyParser = require('body-parser')
const ejsLayouts = require('express-ejs-layouts')
const express = require('express')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const passport = require('./config/ppConfig')
const path = require('path')
const session = require('express-session')
const authRoutes = require('./routes/auth_router')
const userRoutes = require('./routes/user_router')
const eventRoutes = require('./routes/event_router')
const isLoggedIn = require('./middleware/isLoggedIn')
const moment = require('moment')
const tools = require('./lib/tools')
const app = express()

require('dotenv').config({silent: true})

mongoose.connect('mongodb://localhost/bfittest')
mongoose.Promises = global.Promises

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(ejsLayouts)
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialize: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(function (req, res, next) {
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.locals.simpleFormat = tools.simpleFormat
app.locals.dateFormat = tools.dateFormat


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.redirect('/event')
})
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/event', eventRoutes)

module.exports = app.listen(3000, () => {
  console.log('Server up and listening to port 3000')
})