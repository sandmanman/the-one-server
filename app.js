const path = require('path');
const express = require('express');
const mongoose = require('mongoose')
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');
const winston = require('winston');
const expressWinston = require('express-winston');

const app = express();

// 连接数据库
const dbOptions = {
  useNewUrlParser: true,
  autoIndex: false
};
mongoose.connect(config.mongodb, dbOptions);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// 跨域设置
// https://github.com/expressjs/cors
app.use(cors());

// 设置视图引擎目录
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 配置一些通用的中间件
//
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended' : false}))
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session 配置
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: true, // 强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new mongoStore({ // 将 session 存储到 mongodb
    url: config.mongodb // mongodb 地址
  })
}));


// 引入路由
routes(app);


// 处理表单及文件上传的中间件
// app.use(require('express-formidable')({
//   uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
//   keepExtensions: true// 保留后缀
// }));

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));


// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

if (module.parent) {
  // 被 require，则导出 app
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
  });
}
