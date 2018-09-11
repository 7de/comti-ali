import api from '/common/api.js';
const app = getApp()
const orderURL = 'platform/platform/smartCard/findCtkSmartCardList' // 订单列表
Page({
  data: {
    allData: []
  },
  onLoad() {},
  addCard () {
    my.navigateTo({
      url: '/page/card-add/card-add?num=010180900001'
    })
  }
});
