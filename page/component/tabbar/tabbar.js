export default {
  handleZanTabChange(e) {
    let { itemId: selectedId } = e.target.dataset
    console.info('[zan:tab:change]', { selectedId })
    // this.$emit('zanTabChange', selectedId)
  }
}