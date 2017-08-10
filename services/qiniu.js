const qiniu = require('qiniu')

const accessKey = 'Yc-ddtGE46uCarACVI66b28vORkktAGoWdd821Ow'
const secretKey = 'H0MJMbEPVgv1gEmkeCI6ie1kTqW4Ka4A0aAuI54y'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const config = new qiniu.conf.Config()
const bucket = 'community'
config.zone = qiniu.zone.Zone_z0 // 空间对应的机房
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

const getUploadToken = (options) => { //
  const optionsTmp = options || {scope: bucket}
  const putPolicy = new qiniu.rs.PutPolicy(optionsTmp)
  return putPolicy.uploadToken(mac)
}

const uploader = (key, file, options = {}) => {
  return new Promise((res, rej) => {
    formUploader.putStream(
      getUploadToken({scope: bucket + ':' + key}),
      key, file, putExtra,
      function (respErr, respBody, respInfo) {
        if (respErr) {
          throw respErr
        }
        if (Number(respInfo.statusCode) === 200) {
          res({code: 200, data: respBody})
        } else {
          rej({code: respInfo.statusCode, data: respBody})
        }
      }
    )
  })

}

module.exports = {
  bucket,
  getUploadToken,
  uploader,
}

//test

// const localFile = __dirname + '/../public/upload/WX20170810-105936@2x.png'
//
// uploader('123456123.txt', localFile)
//   .then(data => {
//     console.log(data)
//   })
//   .catch(e => {
//     console.log(e)
//   })