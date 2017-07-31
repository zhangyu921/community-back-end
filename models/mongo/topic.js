const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  content: String,
  userId: {type: String},
})

const topicSchema = new mongoose.Schema({
  title: {type: String, required: 1},
  content: {type: String, required: 1, limit: 5},
  userId: {type: String, required: 1},
  replies: [replySchema]
})

const topicModel = mongoose.model('topic', topicSchema)

const getTopics = async function (params = {page: 0, pageSize: 10}) {
  return await topicModel.find({}, null, {
    limit: params.pageSize,
    skip: params.pageSize * params.page
  })
    .catch(e => {
      throw new Error(e)
    })
}

const getTopicById = async function (id) {
  return await topicModel.findOne({_id: id})
    .catch(e => {
      throw new Error(e)
    })
}

const createTopic = async function (params) {
  let topic = new topicModel(params)
  return await topic.save()
    .catch(e => {
      throw new Error(e)
    })
}

const deleteTopicById = async function (id) {
  return await topicModel.findOneAndRemove({_id: id})
    .catch(e => {
      throw new Error(e)
    })
}

const upDateTopicById = async function (id, params) {
  return await topicModel.findOneAndUpdate({_id: id}, params, {new: 1})
    .catch(e => {
      throw new Error(e)
    })
}

const createReply = async function (topicId, params) {
  return await topicModel.findOne({_id: topicId})
    .then(topic => {
      topic.replies.unshift(params)
      return topic.save()
    })
    .catch(e => {
      throw new Error(e)
    })
  // if (!topic) {throw new Error('invalid topic id')}
}

module.exports = {
  model: topicModel,
  getTopics,
  getTopicById,
  createTopic,
  upDateTopicById,
  deleteTopicById,
  createReply,
}