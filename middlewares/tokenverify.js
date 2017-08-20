// const JWT = require('jsonwebtoken')
// const JWT_SECRET = require('../cipher').JWT_SECRET
// const userModel = require('../models/mongo/user')

// const tokenVerify = function (options) {
//   return function (req, res, next) {
//     const Authorization = req.session.token
//     if (!Authorization || typeof Authorization !== 'string') {
//       throw new ErrorBaseHTTP('No token received', 200001,
//         400, '尚未登录，请登录后重试~')
//     }
//     const authObj = verifyToken(Authorization)
//     if (Date.now() - authObj.expire > 0) {
//       throw new ErrorBaseHTTP('Token expired', 200002,
//         400, '证书已过期，请重新登录')
//     }
//     req.tokenData = authObj
//     next()
//   }
// }
//
// function verifyToken (str) {
//   try {
//     const auth = str.split(' ')[1]
//     return JWT.verify(auth, JWT_SECRET)
//   }
//   catch (e) {
//     throw new ErrorBaseHTTP('invalidate token', 200002,
//       400, 'token不符合要求，请重新登录')
//   }
// }

const tokenVerify = function (options) {
  return function (req, res, next) {
    const Authorization = req.session.userId
    if (!Authorization || typeof Authorization !== 'string') {
      // res.redirect('/login')
      throw new ErrorBaseHTTP('No userId received', 200001,
        400, '尚未登录或已过期，请登录后重试~')
    }
    next()
  }
}

module.exports = tokenVerify