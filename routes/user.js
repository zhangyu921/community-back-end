const express = require('express')
const router = express.Router()
const userModel = require('../modules/mongo/user')

/* GET users listing. */

router.route('/')
  .get((req, res, next) => {
    (async () => {
      return userModel.model.find({})
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .post((req, res, next) => {
    (async (params) => {
      return userModel.createUser(params)
    })(req.body)
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id')
  .get((req, res, next) => {
    (async (id) => {
      return userModel.getUserById(id)
    })(req.params.id)
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .patch((req, res, next) => {
    (async (params) => {
      return userModel.updateUserById(req.params.id, params)
    })(req.body)
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .delete((req, res, next) => {
    (async () => {
      return userModel.deleteUserById(req.params.id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

module.exports = router
