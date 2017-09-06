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

const DEFAULT_PROJECTION = {password: false, phoneNumber: false, __v: false}
const userModel = mongoose.model('user', userSchema)

const getUsers = async function (params = {page: 0, pageSize: 10}) {
  return await userModel.find(
    {},
    DEFAULT_PROJECTION,
    {
      skip: params.page * params.pageSize,
      limit: params.pageSize,
    }
  )
    .catch(e => {throw new Error(e)})
}
const getUserById = async function (id) {
  if (!id) {throw new Error('Get user must provide name')}
  return await userModel.findOne({_id: id})
    .select(DEFAULT_PROJECTION)
    .catch(e => {throw new Error(e)})
}

const createUser = async function (params) {
  const {email, password, nickname} = params
  if (!password || !email || !nickname) {throw new ErrorBaseHTTP('Need email and password')}
  await userModel.findOne({email: params.email})
    .then(res => {
      if (res) {throw new ErrorBaseHTTP('Duplicated mail address', 10005, 400, 'Email已经被注册啦')}
    })

  let innerPassword = await pbkdf2Async(params.password, Cipher.PASSWORD_SALT, 512, 128, 'sha512')
  return await userModel.create({
    email,
    password: innerPassword,
    nickname,
  })
    .catch(e => {throw new Error(e)})
}

const updateUserById = async function (id, params) {
  if (!id) {throw new Error('update user must provide id')}
  return await userModel.findOneAndUpdate({_id: id}, params, {new: true})
    .select(DEFAULT_PROJECTION)
    .catch(e => {throw new Error(e)})
}

const deleteUserById = async function (id) {
  if (!id) {throw new Error('update user must provide id')}
  return await userModel.deleteOne({_id: id})
    .catch(e => {throw new Error(e)})
}

const login = async function (phoneNumber, password) {
  password = await pbkdf2Async(password, Cipher.PASSWORD_SALT, 512, 128, 'sha512')
    .catch(e => {throw new Error(e)})
  const user = await userModel.findOne({phoneNumber, password})
    .select(DEFAULT_PROJECTION)
    .catch(e => {throw new Error(e)})
  if (!user) {throw new ErrorBaseHTTP('No Such User!', 200006, 400, '当前用户不存在~')}
  return user
}

module.exports = {
  model: userModel,
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  login,
}