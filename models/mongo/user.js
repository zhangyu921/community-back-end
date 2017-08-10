const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const util = require('util')
const pbkdf2Async = util.promisify(crypto.pbkdf2)
const Cipher = require('../../cipher')

const userSchema = new Schema({
  name: {type: String, required: true},
  age: {type: Number},
  phoneNumber: {type: String, required: true},
  password: {type: String, required: true, limit: 6},
  avatar: {type: String}
})
userSchema.index({phoneNumber: 1, password: 1})
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
  if (!params.password || !params.phoneNumber) {throw new Error('Need password and phoneNumber for now!')}
  params.password = await pbkdf2Async(params.password, Cipher.PASSWORD_SALT, 512, 128, 'sha512')
  let user = await userModel.create(params)
    .catch(e => {
      if (e.code === 11000) {
        throw new Error(e.errmsg)
      }
      throw new Error(e)
    })
  return {
    _id: user._id,
    name: user.name,
    age: user.age,
  }
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
  if (!user) {throw new Error('No Such User!')}
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