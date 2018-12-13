/**
 * 打开一个webview窗口
 */
export default {
  // 打开一个带webview窗口,通过title来判断是否显示原生导航栏
  openWebview(config) {
    var wv = plus.webview.getWebviewById(config.id);
    if (!wv) {
      wv = plus.webview.create(
        config.url,
        config.id, {
          top: 0, // 新页面顶部位置
          bottom: 0, // 新页面底部位置
          popGesture: config.popGesture || 'close', //窗口的侧滑返回功能
          bounce: 'vertical', //窗口遇到边框是否有反弹效果
          bounceBackground: '#ffffff', //窗口的背景颜色
          titleNView: config.title ? { // 窗口的标题栏控件
            titleText: config.title, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
            titleColor: config.titleColor || '#000000', // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
            titleSize: config.titleSize || "18px", // 字体大小,默认17px
            backgroundColor: config.backgroundColor || '#ffffff', // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
            type: config.titType || 'default', // 透明渐变样式
            progress: config.progress ? config.progress : { // 标题栏控件的进度条样式
              color: '#ed4b7a' // 进度条颜色,默认值为"#00FF00"
            },
            splitLine: { // 标题栏控件的底部分割线，类似borderBottom
              color: config.splitLineColor || "transparent" // 分割线颜色,默认值为"#CCCCCC"
            },
            autoBackButton: config.autoBackButton == false ? false : true // 自动绘制返回箭头
          } : false,
          statusbar: { //窗口状态栏样式
            background: config.statusbarBg || '#ffffff'
          },
          errorPage: "./noNetwork.index.html"
        },
        config.extras || {} //扩展参数
      )
      var w = null;
      wv.onloading = function () { //加载中
        w = plus.nativeUI.showWaiting();
        wv.show('slide-in-right'); // 显示窗口
      }
      wv.onloaded = function () { //加载完成
        if (w) {
          w.close();
          w = null;
        }
      }
      //拦截Webview窗口URL请求
      wv.overrideUrlLoading({ mode: "reject" }, function (e) {
        plus.runtime.openWeb(e.url);
      });
      //Webview窗口错误事件
      wv.onerror = function (e) {
        console.log(e);
      }
    } else {
      plus.webview.show(wv);
      //  		wv.reload(true);
    }
    //不論如何，3s后關閉 Waiting
    setTimeout(function () {
      plus.nativeUI.closeWaiting();
    }, 3000)
  },
  //使用内置Webview窗口打开URL,仅支持http/https地址
  openWeburl(url) {
    plus.runtime.openWeb(url);
  },
  // 绘制底部导航栏
  drawTab(obj) {
    var nviewEvent = plus.nativeObj.View.getViewById("tabBar"); // 获取nview控件对象
    nviewEvent.drawText(obj.text, obj.position, obj.textStyles, obj.id);
  },
  // 切换原生底部导航栏状态显示
  switchTab(index) {
    let options = {
      total: 5, //导航栏目数
      ACTIVE_COLOR: "#ed4b7a", //激活的颜色
      NORMAL_COLOR: "#999999" //正常未点击的颜色
    };
    let start = (index - 1) * 2;
    let end = index * 2;
    var self = plus.webview.getLaunchWebview(),
      nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
      currTag;
    for (let j = 0; j < options.total * 2; j++) {
      currTag = nviewObj.tags[j]; // 获取所有需重绘的tag
      currTag.textStyles.color = options.NORMAL_COLOR;
      let obj = {
        text: currTag.text,
        position: currTag.position,
        textStyles: currTag.textStyles,
        id: currTag.id
      }
      this.drawTab(obj);
    }
    for (let i = start; i < end; i++) {
      currTag = nviewObj.tags[i]; // 获取当前需重绘的tag
      currTag.textStyles.color = options.ACTIVE_COLOR;
      let obj = {
        text: currTag.text,
        position: currTag.position,
        textStyles: currTag.textStyles,
        id: currTag.id
      }
      this.drawTab(obj);
    }
  }
}
