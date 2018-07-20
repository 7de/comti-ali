import api from '/common/api.js'
import page from '/common/page.js';
const app = getApp()
const URL = 'wallet/customWallet/queryBalanceBySession' // 账户余额
Page({
  data: {
    account: '0.00'
  },
  onShow() {
    console.log('账户：' + app.globalData.token)
    // 账户余额查询
    api.get(URL + '?rdSession=' + app.globalData.token).then(res => {
      this.setData({
        account: api.fotmatMoney(res.data)
      })
    })
  }
});
