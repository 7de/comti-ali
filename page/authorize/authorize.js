import api from '/common/api.js'
import page from '/common/page.js'
import httpApi from '/common/interface.js'
const app = getApp()
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
        my.httpRequest({
          url: api.apiData.host + httpApi.postAliAuthorize,
          method: 'POST',
          data: {
            authCode: authCode
          },
          success: (res) => {
            my.hideLoading()
            if (res.data.code === 0) {
              app.globalData.token = res.data.data.access_token
              my.setStorageSync({
                key: 'token_n',
                // data: data.rd_session
                data: res.data.data.access_token
              })
              if(getCurrentPages().length>1){
                page.goBack()
              } else {
                page.goHome()
              }
            } else {
              my.showToast({
                content: res.data.msg,
                type: 'none',
                duration: 2000
              })
            }
          },
          fail: (res) => {
            my.hideLoading()
            my.confirm({
              title: '错误提示',
              content: '网络异常，请稍后再试',
              confirmButtonText: '好的',
              success: (result) => {
                if (result.confirm) {
                }
              }
            })
          }
        })
      },
      fail: (err) => {
        my.hideLoading()
        console.log(err)
      }
    })
  }
});
