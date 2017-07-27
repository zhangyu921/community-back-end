const express = require('express')
const router = express.Router()
const topicModule = require('../modules/in_memo/topic')
const userModule = require('../modules/in_memo/user')
/* GET topics listing. */

router.route('/')
  .get((req, res, next) => {
    (async () => {
      return topicModule.topics
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .post((req, res, next) => {
    (async () => {
      const user = await userModule.getUser(req.body.userId)
      const params = Object.assign({}, req.body, {user})
      return await topicModule.createTopic(params)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      return topicModule.getTopic(req.params.id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .patch((req, res, next) => {
    (async () => {
      return topicModule.updateTopic(req.params.id, req.body)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .delete((req, res, next) => {
    (async () => {
      return topicModule.deleteTopic(req.params.id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id/reply')
  .post((req, res, next) => {
    (async () => {
      const user = await userModule.getUser(req.body.userId)
      const params = Object.assign({}, req.body, {user})
      return await topicModule.addReply(req.params.id, params)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

module.exports = router
