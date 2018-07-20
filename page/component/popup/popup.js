Page({
  data: {
    showPopup: false
  },
  onLoad() {},
  togglePopup() {
    this.showPopup = !this.showPopup
    this.$apply()
  }
});
