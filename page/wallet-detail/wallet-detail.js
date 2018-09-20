import api from '/common/api.js';
const app = getApp()
const recordURL = 'order/refundOrder/'
Page({
  data: {
    loadingShow: true,
    height: '',
    recordList: [],
    pageNum: 1, // 当前页
    pageSize: 8, // 当前页数量
    pagtotal: null // 数据总数
  },
  onLoad() {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },
  onShow() {
    this.getData()
  },
  lower() {
    let _length = this.data.recordList.length
    if (_length === this.data.pagtotal) {
      my.showToast({
        content: '全部加载完了',
        type: 'success'
      })
      return false
    } else {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getData()
    }
  },
  // 获取数据
  getData() {
    let _params = Object.assign({
      rdSession: app.globalData.token,
      start: this.data.pageNum,
      size: this.data.pageSize,
      sortStr: 'update_time',
      sortType: 'desc'
    })
    api.get(recordURL + 'queryBalanceSub', _params, {}, app.globalData.token).then(({data}) => {
      console.log(data)
      if (this.data.pageNum === 1) {
        this.setData({
          recordList: data.list,
          pagtotal: data.totalRow
        })
      } else {
        this.setData({
          recordList: this.data.recordList.concat(data.list)
        })
      }
      this.setData({
        loadingShow: false
      })
    }).catch( err => {
      this.setData({
        loadingShow: false
      })
      console.log(err)
      if (err.code === -1) {
        my.showToast({
          content: err.msg,
          type: 'none',
          duration: 2000
        })
      }
    })
  }
});
