import api from '/common/api.js';
const app = getApp()
const cardUrl = 'platform/platform/smartCard/findCtkSmartCardList' // 卡列表
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
    console.log(this.data.code)
    api.get(cardUrl, {
      code: this.data.code
    }).then(res => {
      console.log(res)
      my.hideLoading()
      let _data = res.data.list[0]
      this.setData({
        cardData: res.data,
        creatTime: this.formatDate(_data.batchTime),
        bindTime: this.formatDate(_data.bindingTime)
      })
    }).catch(err => {
      wepy.hideLoading()
      console.log(err)
    })
  },
  // 时间戳转换
  formatDate(time) {
    const date = new Date(time)
    return api.formatDate(date, 'yyyy-MM-dd hh:mm')
  }
});
