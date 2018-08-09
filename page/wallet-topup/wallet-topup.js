import api from '/common/api.js';
const app = getApp()
const URL = 'wallet/customWallet/queryBalanceBySession'
const payUrl = 'ali/Alipay/jsapi/'
Page({
  data: {
    showLoading: false,
    items: [
      {
        value: '200',
        name: '充￥200'
      },
      {
        value: '100',
        name: '充￥100'
      },
      {
        value: '80',
        name: '充￥80'
      },
      {
        value: '50',
        name: '充￥50'
      },
      {
        value: '20',
        name: '充￥20'
      },
      {
        value: '10',
        name: '充￥10'
      },
      {
        value: '5',
        name: '充￥5'
      },
      {
        value: '3',
        name: '充￥3'
      },
      {
        value: 'oth',
        name: '其他'
      },
    ],
    checkedValue: -1,
    othShow: false,
    money_input: null,
    focus: true,
    account: '--' // 账户余额
  },
  onLoad(query) {
    this.setData({
      account: query.account
    })
  },
  onShow() {
    /* my.showLoading({
      content: '余额查询中...'
    })
    // 账户余额查询
    api.get(URL + '?rdSession=' + app.globalData.token).then(res => {
      my.hideLoading()
      console.log(res)
      if(res.code === 0) {
        this.setData({
          showLoading: false,
          account: parseFloat(api.fotmatMoney(res.data))
        })
      }
    }) */
  },
  blurInput(e) {
    let _floatMoney = parseFloat(e.detail.value)
    this.setData({
      money_input: _floatMoney
    })
  },
  radioChange(e) {
    if (e.detail.value==='oth') {
      this.setData({
        othShow: true
      })
    } else {
      this.setData({
        othShow: false,
        money_input: ''
      })
    }
    this.setData({
      checkedValue: e.detail.value
    })
  },
  onSubmit(e) {
    if (!e.detail.value.lib) {
      my.showToast({
        content: '请选择充值金额'
      })
    } else if (e.detail.value.lib==='oth' && !this.data.money_input) {
      my.showToast({
        content: '请输入充值金额'
      })
    } else if (e.detail.value.lib==='oth' && this.data.money_input < 0.01) {
      my.showToast({
        content: '请输入大于或等于0.01的金额'
      })
      this.setData({
        money_input: ''
      })
    } else {
      let _money = e.detail.value.moneyinp ? e.detail.value.moneyinp : e.detail.value.lib
      let _params = Object.assign({
        rdSession: app.globalData.token,
        subject: '充值' + _money + '元',
        totalFee: _money * 100
      })
      my.confirm({
        title: '温馨提示',
        content: '请确认是否充值' + _money + '元',
        confirmButtonText: '马上充值',
        success: (result) => {
          const _this = this
          if (result.confirm) {
            my.showLoading({
              content: '充值中...'
            })
            api.post(payUrl + 'pay', _params).then( ({data}) => {
              my.hideLoading()
              const _data = data
              my.tradePay({
                orderStr: _data, //完整的支付参数拼接成的字符串，从服务端获取
                success: (res) => {
                  console.log(res.resultCode)
                  console.log(typeof res.resultCode)
                  if (parseInt(res.resultCode) === 9000){
                    my.navigateBack({
                      delta: 1
                    })
                  } else {
                    let _msg = '' 
                    if (parseInt(res.resultCode) === 8000) {
                      _msg = '正在处理中'
                    } else if (parseInt(res.resultCode) === 6004) {
                      _msg = '支付结果未知,请查询商户订单列表中订单的支付状态'
                    } else {
                      _msg = '充值失败，请稍后再试'
                    }
                    my.alert({
                      title: '温馨提示',
                      content: _msg,
                      buttonText: '我知道了',
                      success: () => {
                        my.navigateBack({
                          delta: 1
                        })
                      }
                    })
                  }
                },
                fail: (res) => {
                  my.alert({
                    title: '错误提示',
                    content: '充值失败，请稍后再试',
                    buttonText: '我知道了'
                  })
                }
              })
            })
          }
        },
      })
    }
  },
  // 更新账户余额
  getMoney() {
    api.get(URL + '?rdSession=' + app.globalData.token).then(res => {
      my.hideLoading()
      console.log(res)
      if(res.code === 0) {
        this.setData({
          account: parseFloat(api.fotmatMoney(res.data))
        })
      }
    })
  }
});
