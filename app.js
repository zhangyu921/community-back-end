const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const reqLogger = require('./utils/logger').requestLogger
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieSession = require('cookie-session')
const router = express.Router()

// use winston logger
const logger = require('./utils/logger').logger
global.console.log = logger.info
global.console.error = logger.error
global.console.warn = logger.warn

// add error types
require('./error')

//connect mongodb
require('./services/mongoose')

// routes
const index = require('./routes/index')
const user = require('./routes/user')
const topic = require('./routes/topic')

const app = express()
// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'build', 'favicon.ico')))
app.use(morgan('combined', {stream: {write: message => reqLogger.info(message.trim())}}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: require('./cipher').COOKIE_SESSION_KEY,
  maxAge: 24 * 60 * 60 * 1000
}))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public/build')))

router.use('/', index)
router.use('/user', user)
router.use('/topic', topic)

app.use('/api/v1', router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new ErrorBaseHTTP('Not Found', 400004,
    404, '访问的资源不存在哦~')
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  logger.error('request error', err)
  res.status(err.httpCode || 500)
  res.json({
    code: err.errorCode || 999999,
    msg: err.message || 'unknown error',
    clientMsg: err.clientMsg || '服务器出错了哦，不如换个姿势？',
  })
})

module.exports = app
