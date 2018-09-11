import api from '/common/api.js';
const app = getApp()
const userUrl = 'platform/platform/customer/getCustomerByKey' // 用户信息
const cardUrl = 'platform/platform/smartCard/findSmartCardByCode' // 卡信息
const balanceUrl = 'wallet/customWallet/queryBalanceBySession' // 用户余额
const bindUrl = 'platform/platform/smartCard/updateCtkSmartCard' // 绑定卡
const payUrl = 'wxpay/wxpay/jsapi/pay' // 支付
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
      let _urlBox = _qr.split('card=')
      console.log(_urlBox)
      this.setData({
        code: _urlBox[1]
      })
    }
    if (this.data.code) {
      console.log(this.data.code)
      this.setData({
        newCode: api.fotmatCard(this.data.code)
      })
    }
  },
  onShow() {
    if (app.globalData.token) {
      console.log(app.globalData.token)
      this.getBalance()
      this.getCard()
    } else {
      my.alert({
        title: '提示',
        content: '您暂未授权或授权已过期',
        buttonText: '去授权',
        success: () => {
          my.navigateTo({
            url: '/page/authorize/authorize'
          })
        }
      })
    }
  },
  // input失去焦距
  bindblur(e) {
    let _value = parseFloat(e.detail.value)
    this.setData({
      money_input: _value
    })
  },
  // 账户余额查询
  getBalance() {
    api.get(balanceUrl + '?rdSession=' + app.globalData.token).then(res => {
      console.log(res.code)
      this.setData({
        account: parseFloat(api.fotmatMoney(res.data))
      })
    })
  },
  // 获取卡号信息
  getCard() {
    my.showLoading({
      content: '校验中...'
    })
    console.log('卡信息获取')
    const _this = this
    api.get(cardUrl + '?code=' + this.data.code, {}, {
      'token': app.globalData.token
    }).then(res => {
      my.hideLoading
      console.log('获取成功')
      console.log(res)
      // status 0 未绑定 1 已绑定 2 已注销
      // state null 未绑定 0 自己卡 1 别人卡
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
        console.log('值' + _data)
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
    }).catch(err => {
      my.hideLoading
      console.log('获取失败')
      console.log(err)
    })
  },
  // 充值
  topup() {
    let _money = this.data.money_input
    let _goodTitle = this.data.state === 1 ? '给他人' : ''
    if (!_money) {
      this.showTopTips('请输入充值金额')
    } else if (_money < 0.01) {
      this.showTopTips('请输入大于或等于0.01的金额')
      this,setData({
        money_input: ''
      })
    } else {
      my.confirm({
        title: '温馨提示',
        content: `请确认是否${_goodTitle}充值${_money}元？`,
        confirmButtonText: '马上充值',
        success: (result) => {
          if (result.confirm) {
            api.post(payUrl + '?rdSession=' + app.globalData.token + '&id=' + this.data.userId, {
              goodsId: 1, // 商品ID
              goodsName: '充值' + _money + '元', // 商品名称
              totalfee: _money * 100  // 充值金额 转为以分为单位
            }).then(res => {
              
            })

          }
        }
      })
      wepy.showModal({
        title: '温馨提示',
        content: `请确认是否${_goodTitle}充值${_money}元？`,
        confirmText: '马上充值',
        success: res => {
          const _this = this
          if (res.confirm) {
            api.post(payUrl + '?rdSession=' + _this.$parent.token + '&id=' + this.userId, {
              goodsId: 1, // 商品ID
              goodsName: '充值' + _money + '元', // 商品名称
              totalfee: _money * 100  // 充值金额 转为以分为单位
            }).then(res => {
              console.log(res)
              let _data = res.data
              // 调用支付接口
              wepy.requestPayment({
                'timeStamp': _data.timeStamp,
                'nonceStr': _data.nonceStr,
                'package': _data.package,
                'signType': 'MD5',
                'paySign': _data.paySign,
                'success': res => {
                  _this.getBalance()
                  _this.money_input = ''
                  this.$apply()
                  wepy.showToast({
                    title: '充值成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                'fail': err => {
                  _this.showTopTips('充值失败，请稍后再试')
                  console.log(err.errMsg)
                }
              })
            })
          }
        }
      })
    }
  }
});
