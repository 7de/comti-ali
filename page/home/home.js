import api from '/common/api.js';
const app = getApp()
const markerUrl = 'sites/sites/' // 站点
const equiUrl = 'equip/equipSocket/querySocketStatus' // 设备
const orderURL = 'server/'
Page({
  // ...fullmap,
  data: {
    map:{
      longitude: 113.83692,
      latitude: 22.60545
    },
    markers: [], // 地图标点
    polyline: [], // 路线
    markersinfo: {}, // 标点信息
    mapcontrols: [], // 地图控件
    direction: 'bottom',
    showPopup: false,
    oldMarkerID: null,
    height: '',
    currentMarkersLong: 0,
    currentMarkersLati: 0,
    currentMarkerName: '',
    currentMarkerAddr: '',
  },
  onLoad() {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    this.showCharging()
  },
  onReady(e) {
    // 使用 my.createMapContext 获取 map 上下文
    this.mapCtx = my.createMapContext('map')
    this.getLocation()
    this.mapControl()
    this.getMarkers()
  },
  onShow(){
  },
  // 定位到本地坐标
  movetoPosition() {
    this.mapCtx.moveToLocation()
  },
  // 地图标记
  getMarkers() {
    let that = this
    api.get(markerUrl+'queryMapSiteList').then(res => {
      // console.log(res)
      my.hideLoading()
      that.setData({
        markers: res.data
      })
    })
  },
  // 标记点击事件
  markertap(e) {
    let _markers = this.data.markers
    let _len = _markers.length
    const markerId = parseInt(e.markerId)
    for (let v in _markers) {
      if (_markers[v].id === markerId) {
        this.setData({
          // markersinfo: _markers[v].callout
          markersinfo: _markers[v].callout,
          currentMarkersLong: _markers[v].longitude,
          currentMarkersLati: _markers[v].latitude,
          currentMarkerName: _markers[v]['callout'].siteName,
          currentMarkerAddr: _markers[v]['callout'].siteAddress
        })
      }
    }
    if (!this.data.showPopup && this.data.oldMarkerID !== markerId) {
        this.setData({
          oldMarkerID: markerId,
          showPopup: true
        })
    } else if (!this.data.showPopup && this.data.oldMarkerID === markerId) {
      if(!this.data.showPopup){
        this.setData({
          showPopup: true
        })
      }
    }
  },
  // 显示标点详细信息
  togglePopup() {
    this.setData({
      showPopup: false
    })
  },

  // 地图控件
  mapControl() {
    my.getSystemInfo({
      success: res => {
        console.log(res)
        // 兼容图标显示不一致bug
        let _pix = res.pixelRatio
        let judgeMapIcon = (_pix>2)&&(res.platform==='iOS'||res.brand==='iPhone')
        this.setData({
          mapcontrols: [{
            id: 1,
            iconPath: '/images/location_2.png',
            position: {
              left: 10,
              top: res.windowHeight - (judgeMapIcon?65*res.pixelRatio:170),
              width: judgeMapIcon?24*res.pixelRatio:60,
              height: judgeMapIcon?24*res.pixelRatio:60
            },
            clickable: true
          }, {
            id: 2,
            iconPath: '/images/code_2.png',
            position: {
              left: res.windowWidth / 2 - (judgeMapIcon?22*res.pixelRatio:69),
              top: res.windowHeight - (judgeMapIcon?64*res.pixelRatio:167),
              width: judgeMapIcon?48*res.pixelRatio:135,
              height: judgeMapIcon?20*res.pixelRatio:50
            },
            clickable: true
          }, {
            id: 3,
            iconPath: '/images/user_2.png',
            position: {
              left: res.windowWidth - (judgeMapIcon?25*res.pixelRatio:70),
              top: res.windowHeight - (judgeMapIcon?65*res.pixelRatio:170),
              width: judgeMapIcon?24*res.pixelRatio:60,
              height: judgeMapIcon?24*res.pixelRatio:60
            },
            clickable: true
          }, {
            id: 4,
            iconPath: '/images/pos.png',
            position: {
              left: res.windowWidth / 2 - 14,
              top: res.windowHeight / 2 - 32,
              width: 28,
              height: 28
            },
            clickable: false
          }]
        })
      }
    })
  },
  // 控件点击事件
  controltap(e) {
    switch (e.controlId) {
      case 1: this.movetoPosition()
        break
      case 2: this.openCode()
        break
      case 3: this.openPersonal()
    }
  },

  // 是否授权获取位置
  getLocation() {
    var that = this;
     my.showLoading();
     my.getLocation({
      type: 'gcj02',
      success: (res) => {
        my.hideLoading();
        that.setData({
          map: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
      fail: (err) => {
        my.hideLoading();
        my.getLocation({
          type: 'gcj02',
          success: (res) => {
            that.setData({
              map: {
                longitude: res.longitude,
                latitude: res.latitude
              }
            })
          }
        })
      }
    })
  },
  // 扫码
  openCode(){
    my.scan({
      success: (res) => {
        let _qr = decodeURIComponent(res.qrCode)
        let _qrBox = _qr.split('num=')
        let _code = _qrBox[1]
        let _params = Object.assign({
          rdSession: app.globalData.token,
          tagsFlag: true,
          serialNo: _code
        })
        my.showLoading({
          content: '查询设备...'
        })
        // api.get(equiUrl + '?rdSession=' + app.globalData.token + '&tagsFlag=true' + '&serialNo=' + _code).then(res => {
        api.get(equiUrl, _params).then(res => {
          my.hideLoading()
          my.navigateTo({
            url: '/page/scancode/scancode?num=' + _code
          })
        })
      }
    })
  },
  // 个人中心--先授权获取个人信息
  openPersonal() {
    my.navigateTo({
      url: '/page/personal/personal'
    })
  },
  showToast() {
    my.showToast({
      content: '暂不支持该功能',
      type: 'none'
    })
  },
  // 充电中订单
  showCharging() {
    let _params = Object.assign({
      orderStatus: 0,
      pageNum: 1,
      pageSize: 10,
      rdSession: app.globalData.token
    })
    my.showLoading({
      content: '订单查询中...'
    })
    api.get(orderURL + 'queryOrderNoListMobile', _params).then(({data}) => {
      my.hideLoading()
      let _len = data.length
      if (_len) {
        my.confirm({
          title: '温馨提示',
          content: '您有进行中的订单，是否查看详情？',
          confirmButtonText: '马上查看',
          success: (result) => {
            if (result.confirm) {
              my.navigateTo({
                url: '/page/order/order?selectedId=0'
              })
            }
          }
        })
      }
    })
  },
  goSite() {
    my.confirm({
      title: '温馨提示',
      content: '是否查看"' + this.data.currentMarkerName + '充电站" ？',
      confirmButtonText: '立即查看',
      success: (result) => {
        if (result.confirm) {
          my.openLocation({
            longitude: this.data.currentMarkersLong,
            latitude: this.data.currentMarkersLati,
            name: this.data.currentMarkerName + '充电站',
            address: this.data.currentMarkerAddr,
          })
        }
      },
    });
  }
});
