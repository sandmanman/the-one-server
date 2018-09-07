const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin
// 登录页
router.get('/', checkNotLogin, function(req, res, next){
  res.send('登录页')
})

// POST /signin
// 用户登录
router.post('/', function(req, res, next){
  console.log('ddd')
  //res.send('用户登录')
})

module.exports = router
