const express = require('express')
const router = express.Router()
const auth = require('../middlewares/tokenverify')
const userModel = require('../models/mongo/user')

/* GET users listing. */

router.route('/')
  .get(auth(), (req, res, next) => {
    (async () => {
      return userModel.getUsers()
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .post((req, res, next) => {
    (async () => {
      let user = await userModel.createUser(req.body)
      return {
        code: 0,
        user: {
          _id: user._id,
          name: user.name,
          age: user.age,
        }
      }
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id')
  .get(auth(), (req, res, next) => {
    (async () => {
      return userModel.getUserById(req.token._id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .patch(auth(), (req, res, next) => {
    (async (params) => {
      return userModel.updateUserById(req.params.id, params)
    })(req.body)
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .delete(auth(), (req, res, next) => {
    (async () => {
      return userModel.deleteUserById(req.params.id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

module.exports = router
