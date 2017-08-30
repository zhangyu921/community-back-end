// const axios = require('axios')
// const appID = 'wxe64b5caa00c407b1'
// const appSecret = '99d289dffad0e5cb9573bf12f32c7e50'
// const encodeURI = 'http%3A%2F%2Fzhangyu.website'
//
// const myOpenID = 'o-fgP0uYqcwByvqexAx8c2FoFzHA'
// const myCode = '071YtoOl0KlhMm1QVsNl0MWvOl0YtoO0'
// const redirectURI = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${encodeURI}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
// const getAccessTokenURI = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appID}&secret=${appSecret}&code=${myCode}&grant_type=authorization_code `
//
// // const accessToken = axios.get(getAccessTokenURI)
// //   .then(res => {
// //     console.log(res.data)
// //     return res.data
// //   })
//
// const accessToken = {
//   access_token: 'FD7KCf0B3PtoeqfF8GJTTQ8uvG94NPJbGnFgm23OftkBu-AQG9EIKoSupTFI-nl3MiricAs-1e7cOCfuHlCbNw',
//   expires_in: 7200,
//   refresh_token: 'BPhVl8XNY9QBc6CLOChs4VJH9fibCCjNaumHr4SsC2bTSIf_6SEwzJvHkZvNMBlhUZwkzGSAVhVnHNz4a7ATpw',
//   openid: 'o-fgP0uYqcwByvqexAx8c2FoFzHA',
//   scope: 'snsapi_userinfo'
// }
//
// const getUserInfoURI = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken.access_token}&openid=${accessToken.openid}&lang=zh_CN`
//
// // const go = axios.get(redirectURI)
// //   .then(res => {
// //     console.log(res)
// //     return res.data
// //   })
// //   .catch(e => {console.log(e)})
//
// console.log(redirectURI)