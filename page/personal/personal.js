import api from '/common/api.js'
import page from '/common/page.js'
const app = getApp()
Page({
  data: {
    user:{
      name: '加载中...',
      img: ''
    },
    pathdata: {
        list:[
        {
          title: '我的钱包',
          arrow: 'horizontal',
          extra: '查看余额明细',
          path:'../wallet-detail/wallet-detail'
        },
        {
          iconfont: 'trade',
          arrow: 'horizontal',
          title: '账户余额',
          path: '../wallet/wallet'
        },
        {
          iconfont: 'manageorder',
          arrow: 'horizontal',
          title: '充值记录',
          path: '../wallet-topup-record/wallet-topup-record'
        }
      ]
    },
    settingData: {
      list:[
        /* {
          iconfont: 'email',
          arrow: 'horizontal',
          title: '系统消息',
          path: '../message/message'
        },
        {
          iconfont: 'remind',
          arrow: 'horizontal',
          title: '帮助反馈',
          path: '../help/help'
        }, */
        /* {
          iconfont: 'set',
          arrow: 'horizontal',
          title: '系统设置',
          path: '../setting/setting'
        }, */
        {
          iconfont: 'information',
          arrow: 'horizontal',
          title: '关于我们',
          path: '../about/about'
        }
      ]
    }
  },
  onShow() {
    if (app.globalData.nickName) {
      console.log('全局有')
      this.setData({
        user:{
          name: app.globalData.nickName,
          img: app.globalData.avatar
        }
      })
    } else {
      console.log('没有用户信息')
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          my.getAuthUserInfo({
            success: (userInfo) => {
              this.setData({
                user:{
                  name: userInfo.nickName,
                  img: userInfo.avatar
                }
              })
              app.globalData.nickName = userInfo.nickName
              app.globalData.avatar = userInfo.avatar
            }
          })
        }
      })
    }
  },
  clearStorage() {
    my.confirm({
      title: '温馨提示',
      content: '请确定是否清除本地缓存？',
      success: (result) => {
        if (result.confirm) {
          my.clearStorageSync()
          page.goAuthorize()
        }
      }
    })
  }
});
