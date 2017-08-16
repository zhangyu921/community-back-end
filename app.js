const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const reqLogger = require('./middlewares/req-logger')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

// use winston logger
const logger = require('./utils/logger').logger
global.console.log = logger.info
global.console.error = logger.error
global.console.warn = logger.warn

//connect mongodb
require('./services/mongoose')

// routes
const index = require('./routes/index')
const user = require('./routes/user')
const topic = require('./routes/topic')

const app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(reqLogger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public/build')))

app.use('/', index)
app.use('/user', user)
app.use('/topic', topic)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  logger.error('request error', err)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  // res.render('error')
  res.json({
    code: 1,
    msg: err.message,
  })
})

module.exports = app
