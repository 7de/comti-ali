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
    tab:{
      list:[
        {
          id: 0,
          title: '充电时长'
        },
        {
          id: 1,
          title: '充电电量'
        }
      ],
      selectedId: 0
    },
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
    itemsTime: [
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
    itemsEle: [
      {
        value: '120',
        name: '智能充满自停'
      },
      {
        value: '1',
        name: '1度'
      },
      {
        value: '2',
        name: '2度'
      },
      {
        value: '3',
        name: '3度'
      },
      {
        value: '5',
        name: '5度'
      },
      {
        value: '6',
        name: '6度'
      },
      {
        value: '8',
        name: '8度'
      },
      {
        value: '9',
        name: '9度'
      }
    ],
    checkedValue: '120',
    itemsDis: false, // 不可用
    submitDisabled: true, // 提交按钮不可用
    // butDis: true,
    index: 0,
    account: '加载中...',
    mode: 0, // 下单模式 0 时长 1 电量
    time_value: 12, // 时长
    charger_mode: 3, // 充电模式
    changeFee: '0.00', // 充电费
    serviceFee: '0.00', // 服务费
    totalFee: '0.00', // 总费用
    showTopup: true,  // 是否显示充值按钮
    equiDisabled: false, // 设备是否可以用
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
  },
  onShow(){
    this.getBalance()
    /* if (!this.data.equiDisabled) {
      let _params = Object.assign({
        serialNum: this.data.code,
        chargeTime: this.data.time_value
      })
      this.checkMoney(_params)
    } else {
      this.equiDisabledFun()
    } */
  },
  handleZanTabChange(e) {
    let { itemId: selectedId } = e.target.dataset
    this.setData({
      'tab.selectedId':  selectedId,
    })
    if (selectedId === 1) {
      this.setData({
        mode: 1,
        charger_mode: 2,
        items: this.data.itemsEle
      })
      this.checkIni(9 * 100)
    } else {
      this.setData({
        mode: 0,
        items: this.data.itemsTime
      })
      this.checkIni(12)
    }
  },
  radioChange(e) {
    let _value = e.detail.value
    this.setData({
      checkedValue: _value
    })
    if(_value === '120' && this.data.mode === 0) {
      this.setData({
        time_value: 12,
        charger_mode: 3
      })
    } else if (_value === '120' && this.data.mode === 1) {
      this.setData({
        time_value: 9 * 100,
        charger_mode: 2
      })
    } else if (this.data.mode === 1) {
      this.setData({
        time_value: _value * 100,
        charger_mode: 2
      })
    } else {
      this.setData({
        time_value: _value,
        charger_mode: 0
      })
    }
    if (this.data.code) {
      this.checkMoney()
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
  formSubmit(e) {
    console.log(e)
    const _this = this
    let _formId = e.detail.formId
    if (this.data.equiDisabled) {
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
            console.log(this.data.charger_mode)
            let _params = {
              formId: _formId,
              chargerMode: this.data.charger_mode,
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
            api.post(chargrURL + 'chargeStart', JSON.stringify(_params), {
              'content-type': 'application/json'
            }, app.globalData.token).then( res => {
              my.hideLoading()
              const {data} = res
              _this.setData({
                submitDisabled: false
              })
              my.reLaunch({
                url: '/page/charging/charging?orderNo=' + data + '&time=' + _this.data.time_value + '&equipNo=' + _this.data.code
              })
            }).catch( err => {
              _this.setData({
                submitDisabled: false
              })
              my.hideLoading()
              if (err.code === -1) {
                my.showToast({
                  content: err.msg,
                  type: 'none',
                  duration: 2000
                })
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
    if (this.data.code) {
      my.httpRequest({
        url: api.apiData.host + equiUrl + '?serialNo=' + this.data.code + '&tagsFlag=true',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + app.globalData.token
        },
        success: res => {
          const _this = this
          console.log(res)
          my.hideLoading()
          if (res.data.code === 0) {
            _this.setData({
              equiDisabled: false,
              showLoading: false,
              showTopup: false,
            })
            // 默认选中充满自停
            if (_this.data.mode === 1) {
              _this.checkIni(9 * 100)
            } else {
              _this.checkIni(12)
            }
          } else {
            _this.setData({
              equiDisabled: true,
              items: _this.data.items,
              checkedValue: -1
            })
            _this.equiDisabledFun()
            if (res.data.code === -50) {
              _this.timeoutEqui(res.data.msg)
            } else if (res.data.code === -100) {
              wepy.navigateTo({
                url: '/page/authorize/authorize'
              })
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
    } else {
      my.showToast({
        type: 'none',
        content: '未填设备ID'
      })
    }
  },
  // 预估金额查询
  checkMoney() {
    const _this = this
    let _mode = ''
    if (this.data.mode === 1) {
      _mode = 2
    }
    let _params = Object.assign({
      serialNum: this.data.code,
      chargeTime: this.data.time_value,
      chagerMode: _mode
    })
    // 查询费用
    my.showLoading({
      content: '费用查询中...'
    })
    api.get(chargrURL + 'getServerPayInfo', _params, {}, app.globalData.token).then(({data}) => {
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
    api.get(balaneURL + 'queryBalanceBySession', {}, {}, app.globalData.token).then(res => {
      if (res.code === 0) {
        this.setData({
          showLoading: false,
          showTopup: false,
          submitDisabled: false,
          account: parseFloat(api.fotmatMoney(res.data))
        })
        this.checkEqui()
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
  // 设备不可用,时长默认不选择,预估金额为零
  equiDisabledFun() {
    this.setData({
      checkedValue: -1,
      time_value: 0,
      changeFee: api.fotmatMoney(0),
      serviceFee: api.fotmatMoney(0),
      totalFee: api.fotmatMoney(0)
    })
  },
  // 电量初始化
  checkIni(value) {
    if (!this.data.equiDisabled) {
      this.checkMoney()
      this.setData({
        checkedValue: '120',
        time_value: value
      })
    } else {
      this.equiDisabledFun()
      /* my.showToast({
        content: '设备不可用',
        type: 'none',
        duration: 2000
      }) */
    }
  },
  // 跳转在线充值
  goTopup() {
    my.navigateTo({
      url: '/page/wallet-topup/wallet-topup?account=' + this.data.account
    })
  }
});
