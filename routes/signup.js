const express = require('express')
const router = express.Router()

const UserModel = require('../models/user')
//const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup
// 注册页
// router.get('/', checkNotLogin, function(req, res, next){
//   res.send('注册页')
// })

// POST /signup
// 用户注册
router.post('/', function(req, res){
  //console.log('signup post',req.body)

  const name = req.body.name
  const email = req.body.email
  const gender = req.body.gender
  const bio = req.body.bio || '这家伙很懒，什么都没留下。'
  const avatar = req.body.avatar || null
  let password = req.body.password
  const repassword = req.body.repassword

  // 参数校验
  if(!name || name.length == 0 && name.length > 50){
    return res.status(400).json({
      success: 'false',
      message: '名字请限制在 1-50 个字符'
    })
  }
  if(!gender || ['m','f','x'].indexOf(gender) == -1) {
    return res.status(400).json({
      success: 'false',
      message: '性别只能是男、女或保密'
    })
  }
  if(!email || !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)) {
    return res.status(400).json({
      success: 'false',
      message: '邮箱格式不正确'
    })
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: 'false',
      message: '密码至少6位字符'
    })
  }
  if (!repassword || password !== repassword) {
    return res.status(400).json({
      success: 'false',
      message: '两次输入密码不一致'
    })
  }
  if (bio.length > 255) {
    return res.status(400).json({
      success: 'false',
      message: '个人简介请限制在 1-255 个字符'
    })
  }
  // 待写入数据库
  let user = {
    name: name,
    email: email,
    password: password,
    gender: gender,
    avatar: avatar,
    bio: bio
  }

  //console.log(user)

  // 写入数据库
  UserModel.create(user, (err, user) => {
    if(err) {
      console.log('写入数据库报错', err.message)
      // 用户名被暂用，继续跳转到注册
      if(err.message.match('duplicate key')) {
        return res.status(400).json({
          success: 'false',
          message: '名字已被注册，请换一个名字试试。'
        })
      } else {
        return res.status(400).json({
          success: 'false',
          message: '注册失败'
        })
      }
    }

    // 此 user 是插入 mongodb 后的值，包含 _id
    let postUser = user
    // 删除密码这种敏感信息，将用户信息存入 session
    delete user.password
    // 将用户信息存入 session
    req.session.user = user

    res.status(200).json({
      success: 'true',
      message: '注册成功'
    })
  })

})


module.exports = router
