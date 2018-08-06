import api from '/common/api.js'
import page from '/common/page.js';
const app = getApp()
const URL = 'wallet/customWallet/queryBalanceBySession' // 账户余额
Page({
  data: {
    showLoading: false,
    account: '--',
  },
  onLoad() {
  },
  onShow() {
    // 账户余额查询
    api.get(URL + '?rdSession=' + app.globalData.token).then(res => {
      console.log(res)
      if (res.code === -1) {
        console.log('报错了')
      }
      this.setData({
        showLoading: false,
        account: parseFloat(api.fotmatMoney(res.data))
      })
    })
  }
});
