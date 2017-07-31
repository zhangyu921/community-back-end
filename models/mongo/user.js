const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {type: String, required: true, index: true, unique: true},
  age: {type: Number}
})

const userModel = mongoose.model('user', userSchema)

const getUsers = async function (params = {page: 0, pageSize: 10}) {
  return await userModel.find({}, {
    skip: params.page * params.pageSize,
    limit: params.pageSize
  })
    .catch(e => {
      throw new Error(e)
    })
}
const getUserById = async function (id) {
  if (!id) {throw new Error('Get user must provide name')}
  return await userModel.findOne({_id: id})
    .catch(e => {throw new Error(e)})
}

const createUser = async function (params) {
  const user = new userModel(params)
  return await user.save()
    .catch(e => {throw new Error(e)})
}

const updateUserById = async function (id, params) {
  if (!id) {throw new Error('update user must provide id')}
  return await userModel.findOneAndUpdate({_id: id}, params, {new: true})
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
  createUser,
  updateUserById,
  deleteUserById,
}