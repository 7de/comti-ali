import api from '/common/api.js';
const app = getApp()
const cardUrl = 'platform/platform/smartCard/findCtkSmartCardList' // 卡列表
Page({
  data: {
    allData: [],
    height: '',
    pageNum: 1, // 当前页
    pageSize: 6, // 当前页数量
    pagtotal: null // 数据总数
  },
  onLoad() {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight,
          pageSize: Math.round(res.windowHeight / 95) + 1
        })
        this.getCard(this.data.pageNum)
      }
    })
  },
  onShow() {
    this.getCard(this.data.pageNum)
  },
  onReachBottom() {
    let _length = this.data.allData.list.length
    console.log(_length)
    console.log(this.data.pagtotal)
    if (_length === this.data.pagtotal) {
      my.showToast({
        content: '全部加载完了',
        type: 'success'
      })
    } else {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getCard(this.data.pageNum)
    }
  },
  addCard () {
    my.scan({
      type: 'qr',
      success: (res) => {
        let _qr = decodeURIComponent(res.qrCode)
        let _qrBox = _qr.split('scan?card=')
        let _code = _qrBox[1]
        if (_code) {
          my.navigateTo({
            url: '/page/card-add/card-add?num=' + _code
          })
        } else {
          my.alert({
            title: '错误提示',
            content: '二维码有误，请重新扫码',
            buttonText: '好的',
            success: () => {
            }
          })
        }
      },
    })
  },
  // 获取卡列表
  getCard(pageNum) {
    const _this = this
    api.get(cardUrl, {
      start: pageNum,
      size: this.data.pageSize
    }, {
      'token': app.globalData.token
    }).then(res => {
      my.hideLoading()
      const _data = res.data
      if (pageNum === 1) {
        _this.setData({
          allData: _data,
          pagtotal: res.data.totalRow
        })
      } else {
        _this.setData({
          'allData.list': _this.data.allData.list.concat(_data.list)
        })
      }
    }).catch(err => {
      console.log(err)
      my.hideLoading()
      console.log('请求错误')
    })
  },
  // 进入详情
  gotoDetail(e) {
    console.log(e)
    let _code = e.target.dataset.code
    my.navigateTo({
      url: `/page/card-detail/card-detail?code=${_code}`
    })
  }
})
