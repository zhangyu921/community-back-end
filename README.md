# community-back-end
采用 Node, Express, Mongo 搭建的社区后端服务

Postman API接口：
https://www.getpostman.com/collections/0c1a98709fd7525bed67

## 启动方式
```
node bin/www
```

## 
- [x] topic 的路由及模型
- [x] user 路由模型及鉴权认证（cookie-session）
- [x] 部署图片上传 Multer
- [x] 图片上传至七牛云
- [x] 部署 winston 日志记录
- [x] 配置错误处理方式
- [x] 实现文章作者信息联合查询 populate
- [ ] 使用 aggregate 方式，联合数据。

## Log：
### 0724：
- 完成了topic和user的router和module
- 改用对象方式存储user和topic信息
- 添加了用户的删除方法

### 0731:
- 完成了mongoose models的改造
- 将console.log添加到错误处理中间件上，减少代码重写

### 0801
- 完成了登录token user鉴权
- 添加token验证后直接将token写入req中，方便下个中间件读取

### 0809 
- 部署图片上传 Multer

### 0810 
- 部署七牛上传头像接口
- 改用流方式上传头像

### 0815
- 添加winston库
- 添加CORS跨域支持

### 0816
- 部署winston打日志记录
- 部署了新的错误处理方式
- 以生产环境在远端服务器上启动

### 0817
- 改用morgan生成请求数据并写入winston日志。morgan生成的较为详细，而且能获得服务器返回的statusCode
- 改用cookie-session做鉴权验证

### 0906 
- 优化了各个数据模型

### 0908 
- 实现了文件列表接口的联合查询作者用户信息

### 2017-09-11
- 改用Mongoose的populate方法实现用户信息查询，代码整洁了很多
