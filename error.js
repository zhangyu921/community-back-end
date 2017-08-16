class ErrorBaseHTTP extends Error {
  constructor (msg, errorCode, httpCode, clientMsg) {
    super(msg)
    this.errorCode = errorCode
    this.httpCode = httpCode
    this.clientMsg = clientMsg
  }
}

class ErrorValidation extends ErrorBaseHTTP {
  constructor (path, reason, clientMsg) {
    const errorCode = 100001
    const httpCode = 400
    super(`Error validating param, path: ${path}, reason: ${reason}`,
      errorCode, httpCode, clientMsg || '参数错误，请检查后重试~')
  }
}

/*
module.exports = {
  ErrorBaseHTTP,
  ErrorValidation,
}
*/

global.ErrorBaseHTTP = ErrorBaseHTTP
global.ErrorValidation = ErrorValidation