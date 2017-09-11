const express = require('express')
const router = express.Router()
const User = require('../models/user')
const util = require('util')
const crypto = require('crypto')
const pbkdf2Async = util.promisify(crypto.pbkdf2)
const Cipher = require('../cipher')

/* GET home page. */
/*router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'})
})*/

router.post('/login', (req, res, next) => {
  (async () => {
    const {email, password} = req.body
    if (!email || !password) {
      throw new ErrorValidation('login', 'No email or password')
    }
    const user = await User.getUserByEmail(email)
      .catch(e => {throw new Error(e)})
    if (!user) {throw new ErrorBaseHTTP('No Such User!', 200006, 400, '当前用户不存在~')}

    let innerPassword = await pbkdf2Async(password, Cipher.PASSWORD_SALT, 512, 128, 'sha512')
      .catch(e => {throw new Error(e)})
    if (user.password.toString() !== innerPassword.toString()) {throw new ErrorBaseHTTP('Password invalid', 10009, 400)}
    return user
  })()
    .then(data => {
      req.session.userId = data._id
      res.json({
        code: 0,
        data: {
          _id: data._id,
          nickname: data.nickname,
          email: data.email,
          avatar: data.avatar
        }
      })
    })
    .catch(err => {next(err)})
})

router.get('/logout', (req, res, next) => {
  (async () => {
    req.session = null
  })()
    .then(data => res.json({
      code: 0,
    }))
    .catch(err => next(err))
})

module.exports = router
