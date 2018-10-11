Page({
  data: {},
  onLoad() {
    my.showLoading({
      content: '加载中...'
    })
  },
  onShow(){
    setTimeout(function() {
      my.hideLoading()
    }, 2000)
  }
});
