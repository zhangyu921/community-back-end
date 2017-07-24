/**
 * Created by yuzhang on 2017/7/23.
 */

let TOPIC_ID_INIT = 10000
let REPLY_ID_INIT = 10000
let topics = {}

class Topic {
  constructor (params) {
    if (!params.title || !params.content || !params.userId) throw new Error('invalid params')
    this._id = TOPIC_ID_INIT++
    this.title = params.title
    this.content = params.content
    this.userId = params.userId
    this.replys = []
  }
}

class Reply {
  constructor (params) {
    if (params.userId && params.content) {
      this._id = REPLY_ID_INIT++
      this.userId = params.userId
      this.content = params.content
    } else {
      throw new Error('invalid params')
    }
  }
}

const createTopic = async function (params) {
  const topic = new Topic(params)
  topics[topic._id] = topic
  return topic
}

const deleteTopic = async function (id) {
  if (!id) {throw new Error('update topic must provide id')}
  if (!topics[id]) {throw new Error('Invalid id')}
  return delete topics[id]
}

const updateTopic = async function (id, params) {
  if (!id) {throw new Error('update topic must provide id')}
  if (!topics[id]) {throw new Error('Invalid id')}
  topics[id] = Object.assign({}, topics[id], params)
  return topics[id]
}

const getTopic = async function (id) {
  if (!id) {throw new Error('Get topic must provide id')}
  const topic = topics[id]
  if (topic) {
    return topic
  } else {
    throw new Error('Invalid id')
  }
}

const addReply = async function (id, params) {
  if (!id) {throw new Error('Get topic must provide topic id')}
  if(topics[id]){
    let reply = new Reply(params)
    topics[id].replys.unshift(reply)
    return reply
  } else {
    throw new Error('Invalid id')
  }
}

module.exports = {
  method: Topic,
  topics,
  createTopic,
  getTopic,
  updateTopic,
  deleteTopic,
  addReply,
}