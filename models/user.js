const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const util = require('util')
const pbkdf2Async = util.promisify(crypto.pbkdf2)
const utility = require('utility')
const Cipher = require('../cipher')

const userSchema = new Schema({
  nickname: {type: String},
  email: {type: String},
  password: {type: String},
  avatar: {type: String},
  wx_id: {type: String},
  wx_access_token: {type: String},
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
})
userSchema.virtual('avatar_url').get(function () {
  let url = this.avatar || ('https://gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48')

  // www.gravatar.com 被墙
  url = url.replace('www.gravatar.com', 'gravatar.com')

  // 让协议自适应 protocol，使用 `//` 开头
  if (url.indexOf('http:') === 0) {
    url = url.slice(5)
  }

  // 如果是 github 的头像，则限制大小
  if (url.indexOf('githubusercontent') !== -1) {
    url += '&s=120'
  }

  return url
})
userSchema.index({email: 1}, {unique: true})
userSchema.index({wx_access_token: 1})
userSchema.index({wx_id: 1})

userSchema.pre('save', function (next) {
  this.update_at = Date.now()
  next()
})

const DEFAULT_PROJECTION = {nickname: true, email: true, avatar: true}
const userModel = mongoose.model('user', userSchema)

const getUsers = async function ({page = 1, pageSize = 10}) {
  return await userModel.find(
    {}, {},
    {
      skip: (page - 1) * pageSize,
      limit: pageSize,
    }
  )
    .catch(e => {throw new Error(e)})
}
const getUserById = async function (id) {
  if (!id) {throw new Error('Get user must provide id')}
  return await userModel.findOne({_id: id})
    .catch(e => {throw new Error(e)})
}
const getUserByEmail = async function (email) {
  if (!email) {throw new Error('Get user must provide email')}
  return await userModel.findOne({email})
    .catch(e => {throw new Error(e)})
}

const createUser = async function (params) {
  const {email, password, nickname} = params
  if (!password || !email || !nickname) {throw new ErrorBaseHTTP('Need email and password')}
  await userModel.findOne({email})
    .then(res => {
      if (res) {throw new ErrorBaseHTTP('Duplicated mail address', 10005, 400, 'Email已经被注册啦')}
    })

  let innerPassword = await pbkdf2Async(password, Cipher.PASSWORD_SALT, 512, 128, 'sha512')
  return await userModel.create({
    email,
    password: innerPassword,
    nickname,
    avatar: 'https://gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=128'
  })
    .catch(e => {throw new Error(e)})
}

const updateUserById = async function (id, params) {
  if (!id || typeof id !== 'string') {throw new Error('update user must provide id')}
  const map = ['nickname', 'avatar']

  return await userModel.findOne({_id: id})
    .then(usr => {
      for (const key in params) {
        if (map.indexOf(key) !== -1) {
          usr[key] = params[key]
        }
      }
      return usr.save()
    })
    .catch(e => {throw new Error(e)})
}

const deleteUserById = async function (id) {
  if (!id) {throw new Error('update user must provide id')}
  return await userModel.deleteOne({_id: id})
    .catch(e => {throw new Error(e)})
}

module.exports = {
  model: userModel,
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUserById,
  deleteUserById,
}