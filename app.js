import api from '/common/api.js'
import page from '/common/page.js'
const loginUrl = 'ali/aliLogin/'
App({
  globalData: {
    hasLogin: false,
    token: null,
    qrCode: null,
    nickName: null, // 用户昵称
    avatar: null // 用户头像
  },
  onLaunch(options) {
    // 普通二维码获取值
    if (options.query && options.query.qrCode) {
      this.globalData.qrCode = options.query.qrCode
    } 
  },
  onShow() {
    let _token = my.getStorageSync({ key: 'token' })
    this.globalData.token = this.globalData.token ? this.globalData.token : _token.data
    console.log('主页：'+ this.globalData.token)
    if (!this.globalData.token) {
      my.navigateTo({
        url: '/page/authorize/authorize'
      })
    }
  },
  onHide() {
  }
});
