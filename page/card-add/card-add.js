import api from '/common/api.js';
const app = getApp()
const userUrl = 'platform/platform/customer/getCustomerByToken' // 用户信息
const cardUrl = 'platform/platform/smartCard/findSmartCardByCode' // 卡信息
const balanceUrl = 'wallet/customWallet/queryBalanceBySession' // 用户余额
const bindUrl = 'platform/platform/smartCard/updateCtkSmartCard' // 绑定卡
const payUrl = 'ali/Alipay/jsapi/pay'
Page({
  data: {
    code: '',
    newCode: '',
    userNickname: '',
    name: '请先绑定用户',
    account: '0.00',
    money_input: null,
    status: null, // 卡状态 0 未绑定 1 已绑定 2 已注销
    state: null, // 归属 null未绑定 0 本人 1 他人
    cardData: {},
    userId: null, // 绑定卡用户ID
    showBtn: true, // 显示绑定按钮
    disBtn: false, // 按钮不可用
    invalidCard: false // 无效卡
  },
  onLoad(option) {
    if (option.num) {
      this.setData({
        code: option.num
      })
    } else if (app.globalData.qrCode) {
      let _qr = decodeURIComponent(app.globalData.qrCode)
      console.log(_qr)
      // let _url = decodeURIComponent(option.q) // 字符分割
      let _urlBox = _qr.split('scan?card=')
      this.setData({
        code: _urlBox[1]
      })
    }
    if (this.data.code) {
      this.setData({
        newCode: api.fotmatCard(this.data.code)
      })
    }
  },
  onShow() {
    this.getCard()
  },
  // input失去焦距
  bindblur(e) {
    console.log(e.detail.value)
    let _value = parseFloat(e.detail.value)
    this.setData({
      money_input: _value
    })
  },
  // 账户余额查询
  getBalance() {
    api.get(balanceUrl, {}, {}, app.globalData.token).then(res => {
      console.log(res.code)
      this.setData({
        account: parseFloat(api.fotmatMoney(res.data))
      })
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
  // 获取卡号信息
  getCard() {
    my.showLoading({
      content: '校验中...'
    })
    console.log('卡信息获取')
    const _this = this
    api.get(cardUrl, {
      code: this.data.code
    }, {
    }, app.globalData.token).then(res => {
      my.hideLoading()
      let _data = res.data
      if (_data) {
        _this.setData({
          showBtn: false,
          status: _data.status,
          state: _data.state,
          userId: _data.userId,
          cardData: _data,
          invalidCard: false
        })
        _this.checkStatus(_data.status)
      } else {
        my.alert({
          title: '温馨提示',
          content: '该卡已注销或不存在，请重新扫码',
          buttonText: '我知道了',
          success: () => {
            _this.setData({
              invalidCard: true
            })
          }
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
  // 充值
  topup() {
    let _money = this.data.money_input
    let _goodTitle = this.data.state === 1 ? '给他人' : ''
    let _goodName = this.data.state === 1 ? '他人' : ''
    if (!_money) {
      my.showToast({
        content: '请输入充值金额'
      })
    } else if (_money < 0.01) {
      my.showToast({
        content: '请输入大于或等于0.01的金额'
      })
      this.setData({
        money_input: ''
      })
    } else {
      my.confirm({
        title: '温馨提示',
        content: `是否${_goodTitle}充值${_money}元？`,
        confirmButtonText: '马上充值',
        success: (result) => {
          const _this = this
          let _params = Object.assign({
            rdSession: app.globalData.token,
            id: this.data.userId,
            subject: `${_goodName}充值${_money}元`,
            totalFee: _money * 100
          })
          if (result.confirm) {
            api.post(payUrl, _params, {}, app.globalData.token).then(({data}) => {
              console.log(data)
              const _data = data
              my.tradePay({
                orderStr: _data, //完整的支付参数拼接成的字符串，从服务端获取
                success: (res) => {
                  if (parseInt(res.resultCode) === 9000){
                    _this.setData({
                      money_input: ''
                    })
                    _this.getBalance()
                  } else {
                    let _msg = '' 
                    if (parseInt(res.resultCode) === 8000) {
                      _msg = '正在处理中'
                    } else if (parseInt(res.resultCode) === 6004) {
                      _msg = '支付结果未知,请查询商户订单列表中订单的支付状态'
                    } else {
                      _msg = '充值失败!'
                    }
                    my.alert({
                      title: '温馨提示',
                      content: _msg,
                      buttonText: '我知道了',
                      success: () => {
                      }
                    })
                  }
                },
                fail: (res) => {
                  console.log('充值失败')
                }
              })
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
          }
        },
        fail: (err) => {
          console.log('充值失败')
        }
      })
    }
  },
  // 绑定
  bindingBtn() {
    const _this = this
    my.confirm({
      title: '温馨提示',
      content: `绑定${_this.data.code}智能卡？`,
      success: (result) => {
        if (result.confirm) {
          let  _params = {
            code: this.data.code,
            nickName: this.data.userNickname,
            source: 2, // 1,微信客户 2,支付宝客户
            token: app.globalData.token
          }
          api.post(bindUrl, JSON.stringify(_params), {
            'content-type': 'application/json'
          }, app.globalData.token).then(res => {
            console.log(res)
            this.getCard()
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
      }
    })
  },
  // 状态处理
  checkStatus(status) {
    const that = this
    if (status === 0) {
      this.getUser()
      my.confirm({
        title: '温馨提示',
        content: `该卡暂未绑定用户，是否绑定？`,
        confirmButtonText: '马上绑定',
        success: (result) => {
          if (result.confirm) {
            that.bindingBtn()
          }
        }
      })
    } else if (status === 1) {
      this.getBalance()
    }
  },
  // 获取用户昵称
  getUser() {
    api.get(userUrl, {}, {}, app.globalData.token).then(res => {
      this.setData({
        userNickname: res.data.nickName
      })
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
