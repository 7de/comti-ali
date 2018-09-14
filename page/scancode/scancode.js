import api from '/common/api.js';
import page from '/common/page.js'
const app = getApp()
const balaneURL = 'wallet/customWallet/' // 钱包
const chargrURL = 'server/' // 开始充电
const equiUrl = 'equip/equipSocket/querySocketStatus' // 查询设备
const formUrl = 'messagepush/service-push'

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
    checkedValue: '120',
    itemsDis: false, // 不可用
    submitDisabled: true, // 提交按钮不可用
    // butDis: true,
    index: 0,
    account: '加载中...',
    time_value: 12, // 时长
    charger_mode: 3, // 充电模式
    changeFee: '0.00', // 充电费
    serviceFee: '0.00', // 服务费
    totalFee: '0.00', // 总费用
    showTopup: true,  // 是否显示充值按钮
    showLoading: true
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
    if (app.globalData.token) {
      this.getBalance()
      this.checkEqui()
    } else {
      my.alert({
        title: '温馨提示',
        content: '您暂未授权或授权已过期',
        buttonText: '去授权',
        success: () => {
          page.goAuthorizeB()
        }
      })
    }
  },
  onShow(){
    if (!this.data.itemsDis) {
      let _params = Object.assign({
        serialNum: this.data.code,
        chargeTime: this.data.time_value
      })
      this.checkMoney(_params)
    } else {
      this.equiDisabledFun()
    }
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
  /* goCharging() {
    const _this = this
    if (this.data.checkedValue < 0) {
      my.showToast({
        content: '请选择充电时长',
        type: 'none'
      })
    } else if (this.data.itemsDis){
      this.checkEqui()
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
            this.setData({
              submitDisabled: true
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
                this.setData({
                  submitDisabled: false
                })
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
                        my.navigateTo({
                            url: '../authorize/authorize'
                        })
                    }
                  })
                } else if (data.code === 0) {
                  my.reLaunch({
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
  }, */
  formSubmit(e) {
    console.log(e)
    const _this = this
    let _formId = e.detail.formId
    /* api.get(formUrl, {formId: _formId}).then(res => {
      console.log(res)
    }) */
    if (this.data.itemsDis) {
      this.checkEqui()
    } else if (this.data.checkedValue < 0){
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
            console.log(_formId)
            let _params = {
              // formId: _formId,
              chargerMode: parseInt(this.data.charger_mode),
              chargerValue: this.data.time_value,
              streamNo: this.data.code,
              totalFee: this.data.totalFee * 100
            }
            my.showLoading({
              content: '开启充电...'
            })
            this.setData({
              submitDisabled: true
            })
            my.httpRequest({
              url: api.apiData.host + chargrURL + 'chargeStart?rdSession=' + app.globalData.token,
              method: 'POST',
              headers: Object.assign({
                'content-type': 'application/json'
              }),
              data: JSON.stringify(_params),
              dataType: 'json',
              success: (res) => {
                my.hideLoading()
                const {data} = res
                this.setData({
                  submitDisabled: false
                })
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
                        my.navigateTo({
                            url: '../authorize/authorize'
                        })
                    }
                  })
                } else if (data.code === 0) {
                  my.reLaunch({
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
        if (res.data.code === 0) {
          this.setData({
            itemsDis: false,
            showLoading: false,
            showTopup: false,
          })
        } else {
          this.setData({
            itemsDis: true,
            items: this.data.items,
            checkedValue: -1
          })
          this.equiDisabledFun()
          if (res.data.code === -50) {
            this.timeoutEqui(res.data.msg)
          } else {
            let _msg = res.data.msg
            my.confirm({
              title: '错误提示',
              content: _msg,
              confirmButtonText: '首页扫码',
              success: (result) => {
                if (result.confirm) {
                  page.goHome()
                }
              }
            })
          }
        }
      },
      fail: res => {
        console.log(res)
        if (res.data.code === -50) {
          this.timeoutEqui(res.data.msg)
        } else {
          my.confirm({
            title: '错误提示',
            content: '网络异常，请稍后重试',
            confirmButtonText: '好的',
            success: (result) => {
              if (result.confirm) {
              }
            }
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
  },
  // 设备超时
  timeoutEqui(msg) {
    const _this = this
    my.confirm({
      title: '温馨提示',
      content: msg,
      confirmButtonText: '重试',
      success: (result) => {
        if (result.confirm) {
          _this.checkEqui()
        }
      }
    })
  },
  // 账户余额查询
  getBalance() {
    api.get(balaneURL + 'queryBalanceBySession', {
      rdSession: app.globalData.token
    }).then(res => {
      if (res.code === 0) {
        this.setData({
          showLoading: false,
          showTopup: false,
          submitDisabled: false,
          account: parseFloat(api.fotmatMoney(res.data))
        })
      }
    })
  },
  // 设备不可用,时长默认不选择,预估金额为零
  equiDisabledFun() {
    this.setData({
      checked_base: -1,
      time_value: 0,
      changeFee: api.fotmatMoney(0),
      serviceFee: api.fotmatMoney(0),
      totalFee: api.fotmatMoney(0)
    })
  },
  // 跳转在线充值
  goTopup() {
    my.navigateTo({
      url: '/page/wallet-topup/wallet-topup?account=' + this.data.account
    })
  }
});
