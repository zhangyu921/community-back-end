# cnode-back-end
采用 Node, Express, Mongo 搭建的社区后端服务

## log：
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

### 0811 
- 发布到了服务器上 可以通过 45.32.69.126:8082 访问

