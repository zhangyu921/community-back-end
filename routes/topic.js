const express = require('express')
const router = express.Router()
const topicModule = require('../modules/in_memo/topic')

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
    (async (params) => {
      return topicModule.createTopic(params)
    })(req.body)
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id')
  .get((req, res, next) => {
    (async (id) => {
      return topicModule.getTopic(id)
    })(req.params.id)
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
      return topicModule.addReply(req.params.id, req.body)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

module.exports = router
