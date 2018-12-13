/**
 * 通过plus.storage保存和读取应用数据
 *
 **/
export default {
  //修改或添加键值(key-value)对数据到应用数据存储中
  setItem(key, value) {
    plus.storage.setItem(key, value);
  },
  //通过键(key)检索获取应用存储的值
  getItem(key) {
    return plus.storage.getItem(key);
  },
  //通过key值删除键值对存储的数据
  removeItem(key) {
    plus.storage.removeItem(key);
  },
  //清除应用所有的键值对存储数据
  removeAll() {
    plus.storage.clear();
  }
}
