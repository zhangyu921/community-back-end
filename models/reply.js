const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const Topic = require('./topic')

const replySchema = new mongoose.Schema({
  content: {type: String},
  topic_id: {type: ObjectId},
  author_id: {type: ObjectId},
  reply_id: {type: ObjectId}, //添加对一条回复的回复时添加reply_id
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
  content_is_html: {type: Boolean},
  ups: [Schema.Types.ObjectId],
  deleted: {type: Boolean, default: false},
})

replySchema.index({topic_id: 1})
replySchema.index({author_id: 1, create_at: -1})

const replyModel = mongoose.model('reply', replySchema)

const getRepliesByTopicId = async function (id, page = 1, pageSize = 10) {
  const replies = await replyModel.find(
    {topic_id: id, deleted: false},
    '',
    {
      sort: 'create_at',
      limit: parseInt(pageSize),
      skip: parseInt(pageSize * (page - 1))
    }
  ).catch(e => {throw new Error(e)})
  if (replies.length === 0) {return []}
  return replies
}

const createReply = async function (params) {
  const {content, topicId, authorId, replyId} = params
  let reply = new replyModel({
    content,
    topic_id: topicId,
    author_id: authorId,
    reply_id: replyId,
  })
  const result = await reply.save()
    .catch(e => {throw new Error(e)})
  if (result) {
    await Topic.model.findOneAndUpdate(
      {_id: topicId},
      {
        last_reply: result._id,
        last_reply_at: result.create_at,
      },
      {new: 1}
    ).catch(e => {throw new Error(e)})
  }
  return result
}

module.exports = {
  model: replyModel,
  getRepliesByTopicId,
  createReply
}