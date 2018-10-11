import api from '/common/api.js'
import page from '/common/page.js';
import httpApi from '/common/interface.js'
const app = getApp()
Page({
  data: {
    showLoading: true,
    account: '--',
    showTopup: true
  },
  onLoad() {
  },
  onShow() {
    // 账户余额查询
    api.get(httpApi.getWallet).then(res => {
      this.setData({
        showLoading: false,
        showTopup: false,
        account: parseFloat(api.fotmatMoney(res.data))
      })
    }).catch( err => {
      this.setData({
        showLoading: false
      })
      if (err.code === -1) {
        my.showToast({
          content: err.msg,
          type: 'none',
          duration: 2000
        })
      }
    })
  },
  // 跳转在线充值
  goTopup() {
    my.navigateTo({
      url: '/page/wallet-topup/wallet-topup?account=' + this.data.account
    })
  }
});
