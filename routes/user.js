const express = require('express')
const router = express.Router()
const fs = require('fs')
const auth = require('../middlewares/tokenverify')
const userModel = require('../models/mongo/user')
const path = require('path')
const multer = require('multer')
const bytes = require('bytes')
const uploader = require('../services/qiniu').uploader
const storage = multer.memoryStorage()
const upload = multer({
  dest: path.join(__dirname, '../tmp'),
  limits: {
    fileSize: bytes('2MB') // 限制文件在2MB以内
  },
  fileFilter: function (req, files, callback) {
    // 只允许上传jpg|png|jpeg|gif格式的文件
    const type = '|' + files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1) + '|'
    const fileTypeValid = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1
    callback(null, !!fileTypeValid)
  }
})

/* GET users listing. */
router.route('/')
  .get(auth(), (req, res, next) => {
    (async () => {
      return userModel.getUsers()
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .post((req, res, next) => {
    (async () => {
      let user = await userModel.createUser(req.body)
      return {
        code: 0,
        user: {
          _id: user._id,
          name: user.name,
          age: user.age,
        }
      }
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

router.route('/:id')
  .get(auth(), (req, res, next) => {
    (async () => {
      return userModel.getUserById(req.token._id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .post(auth(), upload.single('avatar'), (req, res, next) => {
    (async () => {
      console.log('file', req.file)
      return await uploader(req.file.originalname, req.file.path)
    })()
      .then(data => res.json(data))
      .then(fs.unlink(req.file.path, err => {
        if (err) { throw Promise.reject(err)}
      }))
      .catch(err => next(err))
  })

  .patch(auth(), (req, res, next) => {
    (async () => {
      return userModel.updateUserById(req.params.id, req.body)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })
  .delete(auth(), (req, res, next) => {
    (async () => {
      return userModel.deleteUserById(req.params.id)
    })()
      .then(data => res.json(data))
      .catch(err => next(err))
  })

module.exports = router
