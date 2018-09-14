import api from '/common/api.js'
import page from '/common/page.js'
const app = getApp()
const loginUrl = 'ali/aliLogin/login'
Page({
  data: {},
  onLoad() {
  },
  getAuthorize(){
    my.showLoading({
      content: '正在校验信息...'
    })
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        console.log(res)
        const {authCode} = res
        my.hideLoading()
        // 获取用户信息
        my.getAuthUserInfo({
          success: (userInfo) => {
            app.globalData.nickName = userInfo.nickName
            app.globalData.avatar = userInfo.avatar
          }
        })
        // 请求换取令牌
        let _params = Object.assign({
          authCode: authCode
        })
        my.showLoading({
          content: '授权中...'
        })
        api.post(loginUrl, {authCode: authCode}).then( ({data}) => {
          my.hideLoading()
          app.globalData.token = data.rd_session
          my.setStorageSync({
            key: 'token',
            data: data.rd_session
          })
          console.log(getCurrentPages().length)
          if(getCurrentPages().length>1){
            page.goBack()
          } else {
            page.goHome()
          }
        })
      }
    })
  }
});
