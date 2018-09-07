/**
 * check 登录状态
 */

module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if(!req.session.user) {
      req.flash('error', '请登录，再操作。')
      return res.redirect('/signin')
    }
    next()
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if(req.session.user) {
      req.flash('error', '已登录')
      return res.redirect('back') // 如：已登录状态下跳到了登录页面，会返回上一页。同时禁止访问登录、注册页。
    }
    next()
  }
}
