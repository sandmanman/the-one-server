const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

// Users
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  avatar: {
    type: String
  },
  gender: {
    type: String,
    enum: ['m', 'f', 'x'],
    default: 'x'
  },
  bio: {
    type: String,
    trim: true,
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', function(next){
  let user = this
  if(this.isNew) {
    this.createAt = this.updateAt = Date.now
  } else {
    this.updateAt = Date.now
  }

  // 密码加密
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err)

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err)
      user.password = hash
      next()
    })
  })
})

// 自定义方法
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if(err) return cb(err)

      cb(null, isMatch)
    })
  }
}


module.exports = mongoose.model('User', UserSchema)
