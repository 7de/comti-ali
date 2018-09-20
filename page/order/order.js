import api from '/common/api.js';
const app = getApp()
const orderURL = 'server/' // 订单列表
Page({
  data: {
    height: '',
    loadingShow: true,
    loadingsubShow: true,
    timer: '',
    tab:{
      list:[
        {
          id: 3,
          title: '全部'
        },
        {
          id: 0,
          title: '充电中'
        },
        {
          id: 1,
          title: '充电完成'
        },
        {
          id: 2,
          title: '已关闭'
        }
      ],
      selectedId: 3
    },
    currentTab: 3,
    pageSize: 3, // 当前页数量
    allData: [],
    allDataLen: null,
    allPagtotal: null, // 全部总数
    allPagenum: 1
  },
  onLoad(query) {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    if (query.selectedId) {
      this.setData({
        'tab.selectedId':  query.selectedId,
        currentTab: parseInt(query.selectedId)
      })
    }
    this.getData(this.data.allData, this.data.allPagenum, this.data.currentTab, this)
  },
  handleZanTabChange(e) {
    let { itemId: selectedId } = e.target.dataset
    console.info('[zan:tab:change]'+ selectedId)
    this.setData({
      'tab.selectedId':  selectedId,
      currentTab: Number(selectedId),
      loadingsubShow: true,
      allData: [],
      allPagenum: 1
    })
    clearTimeout(this.data.timer)
    this.getData(this.data.allData, this.data.allPagenum, this.data.currentTab, this)
  },
  allLower() {
    let _length = this.data.allDataLen.length
    if (_length === this.data.allPagtotal) {
      my.showToast({ // 如果全部加载完成了也弹一个框
        content: '全部加载完了',
        type: 'success'
      })
      return false
    } else {
      this.setData({
        allPagenum: this.data.allPagenum + 1
      })
      this.getData(this.data.allData, this.data.allPagenum, this.data.currentTab, this)
    }
  },
  // 读取订单列表
  // data 数据列表， pageNum 每页显示数，state 状态
  getData(data, pagenum, state, that) {
    let _params = Object.assign({
      orderStatus: state,
      pageNum: pagenum,
      pageSize: that.data.pageSize,
      rdSession: app.globalData.token
    })
    // api.get(orderURL + 'queryOrderNoListMobile?orderStatus=' + state + '&rdSession=' + app.globalData.token + '&pageNum=' + pagenum + '&pageSize=' + that.data.pageSize).then(res => {
    api.get(orderURL + 'queryOrderNoListMobile', _params, {}, app.globalData.token).then(res => {
      console.log(res)
      if (pagenum === 1) {
        that.setData({
          allData: res,
          allPagtotal: res.dataCount
        })
      } else {
        that.setData({
          'allData.data': that.data.allData.data.concat(res.data),
        })
      }
      console.log(this.data.allData)
      that.setData({
        allDataLen: that.data.allData.data,
        loadingShow: false
      })
      that.timer = setTimeout(() => {
        that.setData({
          loadingsubShow: false
        })
      }, 500)
    }).catch( err => {
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
