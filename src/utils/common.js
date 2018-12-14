import '../assets/css/style.css'
/**
该js为所有页面都必须加载的js
可以用于全局添加某功能
**/

//IOS上延遲很明顯,需要引入
import FastClick from "fastclick";
// 去除300ms延迟
document.addEventListener(
  "DOMContentLoaded",
  function () {
    FastClick.attach(document.body);
  },
  false
);

// 页面调试工具
const VConsole = require("vconsole/dist/vconsole.min.js");
const vConsole = new VConsole();

import Vue from "vue";
import axios from '@/utils/request';
import store from '@/utils/store';
import webview from "@/utils/webview";

Vue.prototype.$axios = axios
Vue.prototype.$store = store;
Vue.prototype.$view = webview;
Vue.prototype.$dbExit = function () {
  plus.webview.currentWebview().removeEventListener('back', function () { });//先取消通用的监听，再自定义新的监听方法
  let clickNum = 0;
  plus.webview.currentWebview().addEventListener('back', function () {
    clickNum++;
    if (clickNum > 1) {
      plus.runtime.quit();
    } else {
      plus.nativeUI.toast("再按一次退出应用");
    }
    setTimeout(function () {
      clickNum = 0
    }, 1000);
    return false;
  });
}
/**
 * 发送自定义事件
 * @param {*} webview
 * @param {*} eventType
 * @param {*} data
 */
Vue.prototype.$fire = function (webview, eventType, data = {}) {
  webview && webview.evalJS(`
      document.dispatchEvent(new CustomEvent("${eventType}", {
        detail:${JSON.stringify(data)},
        bubbles: true,
        cancelable: true
      }));
  `);
};

//由于首页自定义了监听，子页面也会受影响，所以要设置通用的监听方法，首页再单独设置自己的方法
plus.webview.currentWebview().addEventListener('back', function () {
  plus.webview.currentWebview().close();
});
//隐藏页面滚动条
plus.webview.currentWebview().setStyle({
  'scrollIndicator': 'none'
});

