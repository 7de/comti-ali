Page({
  data: {
    array: ['投诉', '建议'],
    index: 0,
    pickerBtn: false,
  },
  onLoad() {},
  bindPickerChange(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value,
        pickerBtn: true
      })
      
    }
});
