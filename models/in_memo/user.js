/**
 * Created by yuzhang on 2017/7/23.
 */

let USER_ID_INIT = 10000
let users = {}

class User {
  constructor (params) {
    if (!params.name || !params.age) throw new Error('invalid params')
    this.name = params.name
    this.age = params.age
    this._id = USER_ID_INIT++
  }
}

const createUser = async function (params) {
  const user = new User(params)
  users[user._id] = user
  return user
}

const deleteUser = async function (id) {
  if (!id) {throw new Error('update user must provide id')}
  if (!users[id]) {throw new Error('Invalid id')}
  return delete users[id]
}

const updateUser = async function (id, params) {
  if (!id) {throw new Error('update user must provide id')}
  if (!users[id]) {throw new Error('Invalid id')}
  users[id] = Object.assign({}, users[id], params)
  return users[id]
}

const getUser = async function (id) {
  if (!id) {throw new Error('Get user must provide id')}
  const user = users[id]
  if (user) {
    return user
  } else {
    throw new Error('Invalid id')
  }
}

module.exports = {
  method: User,
  users,
  createUser,
  getUser,
  updateUser,
  deleteUser,
}