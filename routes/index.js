const config = require('config-lite')(__dirname)

module.exports = function(app) {
  app.use(config.apiBasePath + '/signup', require('./signup'))
  app.use(config.apiBasePath + '/signin', require('./signin'))
  app.use(config.apiBasePath + '/signout', require('./signout'))
  app.use(config.apiBasePath + '/posts', require('./posts'))
  app.use(config.apiBasePath + '/comments', require('./comments'))

  // 处理404
  app.use(function(req, res) {
    if (!res.headersSent) {
      // res.status(404).render('404')
      res.status(404).json({
        success: 'false',
        message: '访问的资源不存在'
      })
    }
  })
}
