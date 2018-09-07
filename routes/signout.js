const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout
// 登出
router.get('/', checkLogin, function(req, res, next){
  res.send('登录')
})

module.exports = router
