const express = require('express')
const router = express.Router()
const userModule = require('../modules/in_memo/user')

/* GET users listing. */

router.route('/')
  .get((req, res, next) => {
    (async () => {
      return userModule.users
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .post((req, res, next) => {
    (async (params) => {
      return userModule.createUser(params)
    })(req.body)
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id')
  .get((req, res, next) => {
    (async (id) => {
      return userModule.getUser(id)
    })(req.params.id)
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .patch((req, res, next) => {
    (async (params) => {
      return userModule.updateUser(req.params.id, params)
    })(req.body)
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .delete((req, res, next) => {
    (async () => {
      return userModule.deleteUser(req.params.id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

module.exports = router
