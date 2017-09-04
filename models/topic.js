const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  content: String,
  userId: {type: String},
})

const topicSchema = new mongoose.Schema({
  title: {type: String, required: 1},
  content: {type: String, required: 1, limit: 5},
  createTime: {type: Date},
  userId: {type: String, required: 1},
  replies: [replySchema]
})

const topicModel = mongoose.model('topic', topicSchema)

const getTopics = async function ({page = 1, pageSize = 10}) {
  if (page < 1) {throw new ErrorValidation('topic', 'page must >= 1', 'page参数应该大于等于1')}
  if (pageSize < 1) {throw new ErrorValidation('topic', 'ageSize must >= 1', 'pageSize参数应该大于等于1')}
  const [data, count] = await Promise.all([
    topicModel.find({}, null, {
      sort: {_id: -1},
      limit: parseInt(pageSize),
      skip: parseInt(pageSize * (page - 1))
    })
      .catch(e => {throw new Error(e)}),
    topicModel.count({})
      .catch(e => {throw new Error(e)})
  ])
  return {page, pageSize, count, data}
}

const getTopicById = async function (id) {
  return await topicModel.findOne({_id: id})
    .catch(e => {throw new Error(e)})
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