import api from '/common/api.js'
import page from '/common/page.js';
const app = getApp()
const URL = 'wallet/customWallet/queryBalanceBySession' // 账户余额
Page({
  data: {
    showLoading: true,
    account: '加载中...',
  },
  onLoad() {
  },
  onShow() {
    // 账户余额查询
    api.get(URL + '?rdSession=' + app.globalData.token).then(res => {
      this.setData({
        showLoading: false,
        account: parseFloat(api.fotmatMoney(res.data))
      })
    })
  }
});
