import api from '/common/api.js'
import page from '/common/page.js'
import httpApi from '/common/interface.js'
Page({
  data: {
    user:{
      name: '加载中...',
      img: '',
      city: ''
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
          iconfont: 'wallet-c',
          arrow: 'horizontal',
          title: '账户余额',
          path: '../wallet/wallet'
        },
        {
          iconfont: 'card',
          arrow: 'horizontal',
          title: '我的卡包',
          path: '../card/card'
        },
        {
          iconfont: 'uutmoney',
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
        {
          iconfont: 'set',
          arrow: 'horizontal',
          title: '系统设置',
          path: '../setting/setting'
        },
        {
          iconfont: 'trust',
          title: '商户合作',
          path: '../cooperation/cooperation'
        },
        {
          iconfont: 'information',
          arrow: 'horizontal',
          title: '关于我们',
          path: '../about/about'
        },
        {
          iconfont: 'kefu',
          title: '帮助与反馈',
          path: '../help/help'
        }
      ]
    },
    showLoading: false
  },
  onLoad() {
  },
  onShow() {
    this.getUserinfo()
  },
  // 获取用户信息
  getUserinfo() {
    api.get(httpApi.getCustomerInfo).then(res => {
      if (res.code === 0) {
        this.setData({
          showLoading: false,
          user:{
            name: res.data.nickName ? res.data.nickName : '未知用户',
            img: res.data.avatarUrl ? res.data.avatarUrl : '/images/user_2.png',
            city: res.data.city ?  res.data.city : '未知'
          }
        })
      }
    }).catch( err => {
      console.log(err)
      my.hideLoading()
      if (err.code === -1) {
        my.showToast({
          content: err.msg,
          type: 'none',
          duration: 2000
        })
      }
    })
  },
  clearStorage() {
    my.confirm({
      title: '温馨提示',
      content: '清除本地缓存将重新授权，是否继续？',
      confirmButtonText: '继续',
      success: (result) => {
        if (result.confirm) {
          my.clearStorageSync()
          page.goAuthorize()
        }
      }
    })
  }
});
