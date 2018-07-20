import page from './page.js'
export default {
    apiData : {
      // 正式
      // host: 'https://www.comtti.net/',
      // 测试
      host: 'https://actor.comtti.net/',
      loginUrl: 'ali/aliLogin/'
    },
    _request(method, url, params, header = {}) {
      const {
        host,
        loginUrl
      } = this.apiData
      return new Promise((resolve, reject) => {
        my.httpRequest({
          url: `${host}${url}`,
          method: method,
          data: params,
          /* headers: Object.assign({
            'content-type': 'application/json'
          }, header), */
          success: res => {
            const {
              data
            } = res
            if (data.code === 500) {
              my.showToast({
                content: '服务器错误，请联系管理员',
                type: 'fail ',
                duration: 2000
              })
              // resolve(this._request(method, url, params))
            } else if (data.code === -1) {
              my.showToast({
                // title: data.msg ? data.msg : data.message,
                content: data.msg,
                type: 'fail',
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
            } else if (res.status === 500) {
              my.showToast({
                content: '服务器错误，请联系管理员',
                type: 'none',
                duration: 2000
              })
            } else {
              resolve(data)
            }
          }
        })
      })
    },
    get(url, params = {}, header = {}) {
      return this._request('GET', url, params, header)
    },
    post(url, params = {}, header = {}) {
      return this._request('POST', url, params, header)
    },
    put(url, params = {}, header = {}) {
      return this._request('PUT', url, params, header)
    },
    delete(url, params = {}, header = {}) {
      return this._request('DELETE', url, params, header)
    },

    // 毫秒转换成时分秒
    formatDuring (mss) {
      // var days = parseInt(mss / (1000 * 60 * 60 * 24));
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = parseInt((mss % (1000 * 60)) / 1000);
      // return days + " : " + hours + " : " + minutes + " : " + seconds;
      return  (hours < 10 ? '0' + hours : hours) + " : " + (minutes < 10 ? '0' + minutes : minutes) + " : " + (seconds < 10 ? '0' + seconds : seconds);
    },
    // 时间戳转换时间
    formatDate (date, fmt) {
      if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
      };
      for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
              let str = o[k] + '';
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
          }
      }
      return fmt;
    },

    // 不足10，前加零
    padLeftZero (str) {
      return ('00' + str).substr(str.length);
    },
    // 金额默认以分为单位，若为整数后面自动补零
    // str 分单位金额
    fotmatMoney(str) {
      let _money = (str/100).toFixed(2)
      return _money
    },
    // 小时转换毫秒
    // 1时(h)=3600000毫秒(ms)
    // 1分(min)=60000毫秒(ms)
    // 1秒(s)=1000毫秒(ms)
    formatMs(time) {
      return time * 3600000
    }
}