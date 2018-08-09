import api from '/common/api.js'
import page from '/common/page.js';
const app = getApp()
const URL = 'wallet/customWallet/queryBalanceBySession' // 账户余额
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
    api.get(URL + '?rdSession=' + app.globalData.token).then(res => {
      console.log(res)
      my.hideLoading()
      this.setData({
        showLoading: false,
        showTopup: false,
        account: parseFloat(api.fotmatMoney(res.data))
      })
    })
  },
  // 跳转在线充值
  goTopup() {
    my.navigateTo({
      url: '/page/wallet-topup/wallet-topup?account=' + this.data.account
    })
  }
});
