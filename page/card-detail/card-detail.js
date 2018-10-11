import api from '/common/api.js';
import httpApi from '/common/interface.js'
const app = getApp()
Page({
  data: {
    cardData: {},
    code: null,
    creatTime: '',
    bindTime: ''
  },
  onLoad(query) {
    my.showLoading({
      content: '加载中...'
    })
    if (query.code) {
      this.setData({
        code: query.code
      })
    }
    this.getCard()
  },
  onShow() {
    setTimeout(function() {
      my.hideLoading()
    }, 10000)
  },
  // 获取卡号信息
  getCard() {
    // const _this = this
    api.get(httpApi.getCardList, {
      code: this.data.code
    }).then(res => {
      my.hideLoading()
      let _data = res.data.list[0]
      this.setData({
        cardData: res.data,
        creatTime: this.formatDate(_data.batchTime),
        bindTime: this.formatDate(_data.bindingTime)
      })
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
  // 时间戳转换
  formatDate(time) {
    const date = new Date(time)
    return api.formatDate(date, 'yyyy-MM-dd hh:mm')
  }
});
