import api from '/common/api.js';
const app = getApp()
const cardUrl = 'platform/platform/smartCard/findCtkSmartCardList' // 卡列表
const delUrl = 'platform/platform/smartCard/updateUntieCard'
Page({
  data: {
    allData: [],
    currentIndex: null,
    startX: null,
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
  touchS(e) {
    console.log(e)
    if(e.touches.length==1){
      this.setData({
        startX:e.touches[0].clientX
      })
    }
  },
  touchM(e) {
    let _index = e.target.dataset.index
    if(e.touches.length==1){
      var moveX = e.touches[0].clientX
      var disX = this.data.startX - moveX;
      if(disX == 0 || disX < 0){
        this.setData({
          currentIndex: null
        })
      }else if(disX > 0 ){
        this.setData({
          currentIndex: _index
        })
      }
    }
  },
  touchE(e) {
    console.log('移动结束')
  },
  // 解绑卡
  delEvent(e){
    let _code = e.target.dataset.code
    my.confirm({
        title: '温馨提示',
        content: '是否删除此卡？',
        success: (result) => {
          if (result.confirm) {
            api.post(delUrl + '?code=' + _code, {}, {}, app.globalData.token).then(res => {
              console.log(res)
              this.setData({
                currentIndex: null
              })
              this.getCard(this.data.pageNum)
            }).catch(err => {
              console.log(err)
              if (err.code === -1) {
                my.showToast({
                  content: data.msg,
                  type: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            this.setData({
              currentIndex: null
            })
          }
        }
    })
    console.log(e)
  },
  addCard() {
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
      size: this.data.pageSize,
      sortStr: 'created_time'
    }, {}, app.globalData.token).then(res => {
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
  // 进入详情
  gotoDetail(e) {
    this.setData({
      currentIndex: null
    })
    let _code = e.target.dataset.code
    my.navigateTo({
      url: `/page/card-detail/card-detail?code=${_code}`
    })
  }
})
