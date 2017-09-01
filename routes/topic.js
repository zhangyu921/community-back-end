const express = require('express')
const router = express.Router()
const topicModel = require('../models/mongo/topic')
const userModel = require('../models/mongo/user')
const auth = require('../middlewares/tokenverify')
/* GET topics listing. */

router.route('/')
  .get((req, res, next) => {
    (async () => {
      return topicModel.getTopics(req.query)
    })()
      .then(data => res.json(Object.assign({code: 0}, data)))
      .catch(err => next(err))
  })
  .post(auth(), (req, res, next) => {
    (async () => {
      const user = await userModel.getUserById(req.session.userId)//验证
      if (!user) { throw new ErrorValidation('user', 'Invalid user', '当前用户不合法') }
      const params = Object.assign({}, req.body, {userId: user._id, createTime: new Date()})
      return await topicModel.createTopic(params)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      return topicModel.getTopicById(req.params.id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .patch(auth(), (req, res, next) => {
    (async () => {
      return topicModel.upDateTopicById(req.params.id, req.body)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .delete(auth(), (req, res, next) => {
    (async () => {
      return topicModel.deleteTopicById(req.params.id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id/reply')
  .post(auth(), (req, res, next) => {
    (async () => {
      const user = await userModel.getUserById(req.session.userId)
      if (!user) {throw new Error('Invalid user id')}
      const params = req.body
      return await topicModel.createReply(req.params.id, params)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

module.exports = router
