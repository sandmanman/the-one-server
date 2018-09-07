const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts
// 获取所有文章或某个用户的文章列表
router.get('/', function(req, res, next){
  res.send('主页')
  // res.json({
  //   "error" : false,
  //   "message" : "Hello World"
  // })
})

// POST /posts/create
// 发表一篇文章
router.post('/create', checkLogin, function(req, res, nect){
  res.send('发表文章')
})

// GET /posts/create
// 发表文章页
router.get('/create', checkLogin, function(req, res, next){
  res.send('发表文章页')
})

// GET /posts/:postId
// 文章详细页
router.get('/:postId', function(req, res, next){
  res.send('文章详细页')
})

// GET /posts/:postId/edit
// 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next){
  res.send('更新文章页')
})

// POST /posts/:postId/edit
// 更新文章
router.post('/:postId/edit', checkLogin, function(req, res, next){
  res.send('更新文章')
})

// GET /posts/:postId/delete
// 删除文章
router.get('/:postId/delete', checkLogin, function(req, res, next){
  res.send('删除文章')
})

module.exports = router
