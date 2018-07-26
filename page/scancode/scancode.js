import api from '/common/api.js';
import page from '/common/page.js'
const app = getApp()
const balaneURL = 'wallet/customWallet/' // 钱包
const chargrURL = 'server/' // 开始充电
const equiUrl = 'equip/equipSocket/querySocketStatus' // 查询设备

Page({
  data: {
    code: null,
    items: [
      {
        value: '120',
        name: '智能充满自停'
      },
      {
        value: '1',
        name: '1小时'
      },
      {
        value: '2',
        name: '2小时'
      },
      {
        value: '3',
        name: '3小时'
      },
      {
        value: '5',
        name: '5小时'
      },
      {
        value: '6',
        name: '6小时'
      },
      {
        value: '8',
        name: '8小时'
      },
      {
        value: '12',
        name: '12小时'
      }
    ],
    checkedValue: -1,
    itemsDis: false, // 不可用
    // butDis: true,
    index: 0,
    account: '加载中...',
    time_value: 0, // 时长
    charger_mode: null, // 充电模式
    changeFee: '0.00', // 充电费
    serviceFee: '0.00', // 服务费
    totalFee: '0.00', // 总费用
  },
  onLoad(query) {
    if (query.num) {
      this.setData({
        code: query.num
      })
    } else if (app.globalData.qrCode) {
      let _qr = decodeURIComponent(app.globalData.qrCode)
      let _qrBox = _qr.split('num=')
      let _code = _qrBox[1]
      this.setData({
        code: _code
      })
    }
  },
  onShow(){
    // 账户余额查询
    my.showLoading({
      content: '余额查询中...'
    })
    api.get(balaneURL + 'queryBalanceBySession?rdSession=' + app.globalData.token).then(res => {
      my.hideLoading()
      if (res.code === 0) {
        this.setData({
          account: parseFloat(api.fotmatMoney(res.data))
        })
      }
    })
    // 设备查询
    this.checkEqui()
  },
  radioChange(e) {
    let _value = e.detail.value
    this.setData({
      checkedValue: _value
    })
    if(_value === '120') {
      this.setData({
        time_value: 12,
        charger_mode: 3
      })
    } else {
      this.setData({
        time_value: _value,
        charger_mode: 0
      })
    }
    if (this.data.code) {
      let _params = Object.assign({
        serialNum: this.data.code,
        chargeTime: this.data.time_value
      })
      this.checkMoney(_params)
    } else {
      my.showToast({
        type: 'none',
        content: '请确认二维码编号是否填写'
      })
    }
  },
  // 编号输入
  keyBlur(e) {
    let _code = e.detail.value
    console.log(_code)
    if (this.data.code !== _code) {
      this.setData({
        code: _code,
        items: this.data.items,
        checkedValue: -1
      })
      this.checkEqui()
    }
  },
  goCharging() {
    const _this = this
    if (this.data.checkedValue < 0) {
      my.showToast({
        content: '请选择充电时长',
        type: 'none'
      })
    } else {
      my.confirm({
        title: '温馨提示',
        content: '请确认是否开始充电？',
        success: (result) => {
          if(result.confirm) {
            let _params = Object.assign({
              chargerMode: parseInt(this.data.charger_mode),
              chargerValue: this.data.time_value,
              streamNo: this.data.code,
              totalFee: this.data.totalFee * 100
            })
            my.showLoading({
              content: '开启充电...'
            })
            my.httpRequest({
              url: api.apiData.host + chargrURL + 'chargeStart?rdSession=' + app.globalData.token,
              method: 'POST',
              headers: Object.assign({
                'content-type': 'application/json'
              }),
              data: JSON.stringify({
                chargerMode: parseInt(this.data.charger_mode),
                chargerValue: this.data.time_value,
                streamNo: this.data.code,
                totalFee: this.data.totalFee * 100
              }),
              dataType: 'json',
              success: (res) => {
                my.hideLoading()
                const {data} = res
                if (data.code === 500 || res.status === 500) {
                  my.showToast({
                    content: '服务器错误，请联系管理员',
                    type: 'fail ',
                    duration: 2000
                  })
                } else if (data.code === -100) {
                  my.alert({
                    title: '提示',
                    content: '授权过期',
                    buttonText: '去授权',
                    success: () => {
                        my.redirectTo({
                            url: '../authorize/authorize'
                        })
                    }
                  })
                } else if (data.code === 0) {
                  my.redirectTo({
                    url: '/page/charging/charging?orderNo=' + data.data + '&time=' + _this.data.time_value + '&equipNo=' + _this.data.code
                  })
                } else {
                  my.showToast({
                    content: data.msg,
                    type: 'none'
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  // 设备查询
  checkEqui() {
    my.showLoading({
      content: '设备查询中...'
    })
    my.httpRequest({
      url: api.apiData.host + equiUrl + '?rdSession=' + app.globalData.token + '&serialNo=' + this.data.code + '&tagsFlag=true',
      method: 'GET',
      success: res => {
        console.log(res)
        my.hideLoading()
        if (res.data.code === -1) {
          let _msg = res.data.msg
          this.setData({
            itemsDis: true,
            items: this.data.items,
            checkedValue: -1
          })
          my.confirm({
            title: '温馨提示',
            content: _msg,
            confirmButtonText: '首页扫码',
            success: (result) => {
              if (result.confirm) {
                page.goHome()
              }
            }
          })
        } else if (res.data.code === 0) {
          /* if(this.data.checkedValue < 0) {
            my.alert({
              title: '提示',
              content: '请选择充电时长进行充电',
              buttonText: '我知道了',
              success: () => {
                console.log('已通知')
              }
            })
          } */
        } else {
          my.showToast({
            content: res.data.msg,
            type: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 预估金额查询
  checkMoney(params) {
    const _this = this
    // 查询费用
    my.showLoading({
      content: '费用查询中...'
    })
    api.get(chargrURL + 'getServerPayInfo', params).then(({data}) => {
      console.log(data)
      my.hideLoading()
      let _changeFee = data.changeFee ? data.changeFee : 0
      let _serviceFee = data.serviceCharge ? data.serviceCharge : 0
      _this.setData({
        changeFee: api.fotmatMoney(_changeFee),
        serviceFee: api.fotmatMoney(_serviceFee),
        totalFee: api.fotmatMoney(Number(_changeFee) + Number(_serviceFee))
      })
      if (_this.data.totalFee > _this.data.account) {
        my.showToast({
          type: 'none',
          content: '您的余额不足以选择此服务，请及时充值。'
        })
        _this.setData({
          items: _this.data.items,
          checkedValue: -1
        })
      }
    })
  }
});
