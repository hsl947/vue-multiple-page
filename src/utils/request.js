/**
 * http请求模块
 */
import axios from 'axios'
import webview from "./webview"
import store from "./store"
import qs from 'qs'

let configs = {
  api: xinjuhao + '/api',
  timeout: 10000
}
axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  if (window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
    plus.nativeUI.toast('网络不稳定，请稍后重试', {
      verticalAlign: 'center'
    });
    plus.webview.currentWebview().endPullToRefresh();
  }
  return Promise.resolve(error.response)
});

export function fetch(url, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: configs.api,
      data: qs.stringify(data),
      timeout: configs.timeout,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      resolve(response.data);
    }, err => {
      reject(err);
    })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  post(url, data = {}) {
    return fetch(url, data)
  },
}
