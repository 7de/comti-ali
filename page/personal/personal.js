import api from '/common/api.js'
import page from '/common/page.js'
const app = getApp()
const URL = 'platform/platform/customer/getCustomerByKey'
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
    },
    showLoading: false
  },
  onLoad() {
  },
  onShow() {
    api.get(URL + '?rdSession=' + app.globalData.token).then(res => {
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
    })
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
