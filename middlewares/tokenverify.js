const JWT = require('jsonwebtoken')
const JWT_SECRET = require('../cipher').JWT_SECRET

const tokenVerify = function (options) {
  return function (req, res, next) {
    try {
      const auth = req.get('Authorization').split(' ')[1]
      if (!auth) {throw new Error('No Auth!')}
      const obj = JWT.verify(auth, JWT_SECRET)
      if (Date.now() - obj.expire > 0) {throw new Error('Token expired!')}
      req.tokenData = obj
      next()
    }
    catch (e) {
      res.statusCode = 401
      next(e)
    }
  }
}

module.exports = tokenVerify