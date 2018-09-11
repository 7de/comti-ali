export default {
  // 跳转首页
  goHome() {
    my.reLaunch({
      url: '/page/home/home'
    })
  },
  // 跳转授权
  goAuthorize() {
    my.reLaunch({
      url: '/page/authorize/authorize'
    })
  },
  // 返回授权
  goAuthorizeB() {
    wepy.navigateTo({
      url: '/page/authorize/authorize'
    })
  },
  // 返回上一级
  goBack() {
    my.navigateBack({
      delta: 1
    })
  }
}