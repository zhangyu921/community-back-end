const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const topicSchema = new mongoose.Schema({
  title: {type: String},
  content: {type: String},
  author_id: {type: ObjectId},
  top: {type: Boolean, default: false}, // 置顶帖
  good: {type: Boolean, default: false}, // 精华帖
  lock: {type: Boolean, default: false}, //被锁定主题
  reply_count: {type: Number, default: 0},
  visit_count: {type: Number, default: 0},
  collection_count: {type: Number, default: 0},
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
  last_reply: {type: ObjectId},
  last_reply_at: {type: Date},
  tab: {type: String},
  deleted: {type: Boolean, default: false},
})

topicSchema.index({create_at: -1})
topicSchema.index({top: -1, last_reply_at: -1})
topicSchema.index({author_id: 1, create_at: -1})

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
  const {title, content, authorId, tab} = params
  let topic = new topicModel({
    title,
    content,
    author_id: authorId,
    tab,
  })
  return await topic.save()
    .catch(e => {throw new Error(e)})
}

const deleteTopicById = async function (id) {
  return await topicModel.findOneAndRemove({_id: id})
    .catch(e => {throw new Error(e)})
}

const upDateTopicById = async function (topicId, params) {
  const {title, content,} = params
  return await topicModel.findOneAndUpdate(
    {_id: topicId},
    {
      title,
      content,
      update_at: Date.now()
    },
    {new: 1}
  )
    .catch(e => {
      throw new Error(e)
    })
}

module.exports = {
  model: topicModel,
  getTopics,
  getTopicById,
  createTopic,
  upDateTopicById,
  deleteTopicById,
}