import api from '/common/api.js'
import page from '/common/page.js'
const app = getApp()
const orderURL = 'server/'
Page({
  data: {
    chargData: {},
    hours: 0,
    minuters: 0,
    seconds: 0,
    charg_timer: 0, // 定时上传订单状态
    timer: 0, // 计时器
    order_no: 0, // 充电订单号
    equip_no: 0, // 设备编码
    charg_activetime: 0, // 所用时间
    time: 0, // 充电时长
    charg_endtime: 0, // 预计结束时间
    charg_longtime: 0, // 环形精度条
    money: 0, // 预计金额
    progress_num: 0
  },
  onLoad(option) {
    this.setData({
      order_no: option.orderNo,
      time: option.time,
      equip_no: option.equip_no
    })
    this.timer = setInterval(() => {
      this.setData({
        seconds: parseInt(this.data.seconds) + 1
      })
      if (this.data.seconds === 60) {
        this.setData({
          seconds: '00',
          minuters: parseInt(this.data.minuters) + 1
        })
        if (this.data.minuters < 10){
          this.setData({
            minuters: '0' + this.data.minuters
          })
        } else {
          this.setData({
            minuters: this.data.minuters
          })
        }
      }
      if (this.data.minuters === 60) {
        this.setData({
          minuters: '00',
          hours: parseInt(this.data.hours) + 1
        })
        if (this.data.hours < 10){
          this.setData({
            hours: '0' + this.data.hours
          })
        } else {
          this.setData({
            hours: this.data.hours
          })
        }
      }
    }, 1000)
  },
  onShow() {
    this.creatData()
    this.charg_timer = setInterval(() => { this.creatData() }, 30000)
  },
  // 结束充电
  goClose() {
    const _this = this
    my.confirm({
      title: '提示',
      content: '请确认是否结束充电？',
      success: (res) => {
        if (res.confirm) {
          my.showLoading({
            content: '正在关闭中...'
          })
          api.get(orderURL + 'chargeEnd/' + this.data.order_no).then(res => {
            my.hideLoading()
            if (res.code === 0) {
              page.goHome()
            }
          })
        }
      }
    })
  },
  // 时间戳转换
  formatDate(time) {
    const date = new Date(time)
    return api.formatDate(date, 'yyyy-MM-dd hh:mm')
  },
  // 查询充电数据
  creatData() {
    my.httpRequest({
      url: api.apiData.host + orderURL + 'queryOrderBrief/' + this.data.order_no,
      method: 'GET',
      success: ({data}) => {
        console.log(data)
        if(data.code === 0) {
          let _data = data.data
          let _oldtime = _data.actieTime
          let _time = api.formatDuring(_oldtime)
          let timeCount = _time.split(':')
          let _progresstime = _oldtime * 100 / api.formatMs(this.data.time)
          this.setData({
            chargData: _data,
            money: api.fotmatMoney(_data.predictFee),
            charg_endtime: this.formatDate(_data.entTime),
            charg_longtime: _progresstime.toFixed(2),
            hours: timeCount[0],
            minuters: timeCount[1],
            seconds: timeCount[2]
          })
        } else if (data.code === -1) {
          clearInterval(this.timer)
          clearInterval(this.charg_timer)
          this.setData({
            isCharging: false
          })
          my.alert({
            title: '温馨提示',
            content: '您本次充电完成',
            buttonText: '我知道了',
            success: () => {
              page.goHome()
            }
          })
        } else {
          my.showToast({
            content: data,msg,
            type: 'none'
          })
        }
      } 
    })
  },
  onHide() {
    console.log('清空30秒')
    clearInterval(this.charg_timer)
  },
  onUnload() {
    clearInterval(this.timer)
    clearInterval(this.charg_timer)
    console.log('清除计时器')
  }
});
