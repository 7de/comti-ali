import api from '/common/api.js';
const app = getApp()
const URL = 'wallet/customWallet/queryBalanceBySession'
const payUrl = 'ali/Alipay/jsapi/'
Page({
  data: {
    showLoading: true,
    items: [
      {
        value: '1000',
        name: '充￥1000'
      },
      {
        value: '500',
        name: '充￥500'
      },
      {
        value: '100',
        name: '充￥100'
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
        value: 'oth',
        name: '其他'
      },
    ],
    checkedValue: -1,
    othShow: false,
    money_input: null,
    focus: true,
    account: '加载中...' // 账户余额
  },
  onLoad() {},
  onShow() {
    my.showLoading({
      title: '余额查询中...',
      mask: true
    })
    console.log('充值：' + app.globalData.token)
    // 账户余额查询
    api.get(URL + '?rdSession=' + app.globalData.token).then(res => {
      my.hideLoading()
      this.setData({
        showLoading: false,
        account: parseFloat(api.fotmatMoney(res.data))
      })
    })
  },
  bindKeyInput(e) {
    let _floatMoney = parseFloat(e.detail.value).toFixed(2)
    if (_floatMoney < 0.01) {
      my.showToast({
        content: '请输入充值金额'
      })
      this.setData({
        money_input: ''
      })
    } else {
      this.setData({
        money_input: e.detail.value
      })
    }
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
    console.log('你选择的金额是：', e.detail.value)
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
    } else {
      let _money = e.detail.value.moneyinp ? e.detail.value.moneyinp : e.detail.value.lib
      console.log('充值金额：' + _money)
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
                  console.log(res)
                  console.log('成功')
                  my.navigateBack({
                    delta: 1
                  })
                },
                fail: (res) => {
                  console.log('shiabi')
                }
              })
            })
          }
        },
      });
      
    }
  }
});
