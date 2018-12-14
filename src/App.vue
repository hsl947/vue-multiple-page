<template>
  <div class="main">主页</div>
</template>
<script>
import "@/assets/css/user.css";

export default {
  data() {
    return {};
  },
  components: {},
  created() {
    let that = this;
    //连续点击2次退出
    this.$dbExit();
    //禁止右滑返回
    plus.webview.currentWebview().setStyle({
      top: 0,
      popGesture: "none"
    });

    //关闭splash页面；
    plus.navigator.closeSplashscreen();
		//初始化h5+首页和切换tab
    this.initH5();
  },
  mounted() {
    let that = this;
    //添加自定义事件
    window.addEventListener("fire", function(event) {
      // JSON.parse(event.detail.data)
    });
    //下拉刷新功能
    plus.webview.currentWebview().setPullToRefresh(
      {
        support: true,
        style: 'circle',
        height: "50px",
        range: "100px"
      },
      function() {
      	setTimeout(function(){
		    	plus.webview.currentWebview().endPullToRefresh();
		    }, 2000)
      }
    );
    
  },
  methods: {
  	initH5() {
  		// 原生tabbar对象操作
	    var util = {
	      options: {
	        ACTIVE_COLOR: "#ed4b7a",
	        NORMAL_COLOR: "#999999",
	        subpages: [
	          "./seek.index.html",
	          "./heartBeat.index.html",
	          "./message.index.html",
	          "./user.index.html"
	        ],
	        subpagesId: ["seek", "heartBeat", "message", "user"],
	        subpage_style: {
	          top: 0,
	          bottom: 50
	        }
	      },
	      /**
	       *  简单封装了绘制原生view控件的方法
	       *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
	       */
	      drawNative: function(id, styles, tags) {
	        var view = new plus.nativeObj.View(id, styles, tags);
	        return view;
	      },
	      /**
	       * 初始化首个tab窗口 和 创建子webview窗口
	       */
	      initSubpage: function(aniShow) {
	        var subpages = util.options.subpages,
	          self = plus.webview.currentWebview(),
	          temp = {};
	
	        // 初始化第一个tab项为首次显示
	        temp[self.id] = "true";
	        Object.assign(aniShow, temp);
	        // 初始化绘制首个tab按钮
	        util.toggleNview(0);
	      },
	      /**
	       * 点击切换tab窗口
	       */
	      changeSubpage: function(targetPage, activePage, aniShow) {
	        //若为iOS平台或非首次显示，则直接显示
	        if (plus.os.name == "iOS" || aniShow[targetPage.id]) {
	          plus.webview.show(targetPage);
	        } else {
	          //否则，使用fade-in动画，且保存变量
	          var temp = {};
	          temp[targetPage.id] = "true";
	          Object.assign(aniShow, temp);
	          plus.webview.show(targetPage);
	        }
	        //隐藏当前 除了第一个父窗口
	        if (activePage !== plus.webview.getLaunchWebview()) {
	          plus.webview.hide(activePage);
	        }
	      },
	      /**
	       * 点击重绘底部tab （view控件）
	       */
	      toggleNview: function(currIndex) {
	        currIndex = currIndex * 2;
	        // 重绘当前tag 包括icon和text，所以执行两个重绘操作
	        util.updateSubNView(currIndex, util.options.ACTIVE_COLOR);
	        util.updateSubNView(currIndex + 1, util.options.ACTIVE_COLOR);
	        // 重绘兄弟tag 反之排除当前点击的icon和text
	        for (var i = 0; i < 10; i++) {
	          if (i !== currIndex && i !== currIndex + 1) {
	            util.updateSubNView(i, util.options.NORMAL_COLOR);
	          }
	        }
	        var self = plus.webview.currentWebview(),
	          nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
	          nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
	          currTag = nviewObj.tags[currIndex + 1];
	      },
	      /*
	       * 改变颜色
	       */
	      changeColor: function(obj, color) {
	        obj.color = color;
	        return obj;
	      },
	      /*
	       * 利用 plus.nativeObj.View 提供的 drawText 方法更新 view 控件
	       */
	      updateSubNView: function(currIndex, color) {
	        var self = plus.webview.currentWebview(),
	          nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
	          nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
	          currTag = nviewObj.tags[currIndex]; // 获取当前需重绘的tag
	        nviewEvent.drawText(
	          currTag.text,
	          currTag.position,
	          util.changeColor(currTag.textStyles, color),
	          currTag.id
	        );
	      }
	    };
	
	    var self = plus.webview.currentWebview();
	    // 创建子webview窗口 并初始化
	    var aniShow = {};
	    util.initSubpage(aniShow);
	
	    var nview = plus.nativeObj.View.getViewById("tabBar"),
	      activePage = plus.webview.currentWebview(),
	      targetPage,
	      subpages = util.options.subpages,
	      subpagesId = util.options.subpagesId,
	      subpage_style = util.options.subpage_style,
	      pageW = window.innerWidth,
	      currIndex = 0;
	
	    /**
	     * 根据判断view控件点击位置判断切换的tab
	     */
	    nview.addEventListener("click", function(e) {
	      var clientX = e.clientX;
	      if (clientX > 0 && clientX <= parseInt(pageW * 0.2)) {
	        currIndex = 0;
	      } else if (
	        clientX > parseInt(pageW * 0.2) &&
	        clientX <= parseInt(pageW * 0.4)
	      ) {
	        currIndex = 1;
	      } else if (
	        clientX > parseInt(pageW * 0.4) &&
	        clientX <= parseInt(pageW * 0.6)
	      ) {
	        currIndex = 2;
	      } else if (
	        clientX > parseInt(pageW * 0.6) &&
	        clientX <= parseInt(pageW * 0.8)
	      ) {
	        currIndex = 3;
	      } else {
	        currIndex = 4;
	      }
	
	      // 不做预加载页面了，点击对应的tab时才创建对应的webview，只创建一次，以后直接显示。
	      function show() {
	        // 匹配对应tab窗口
	        if (currIndex > 0) {
	          targetPage = plus.webview.getWebviewById(subpagesId[currIndex - 1]);
	        } else {
	          targetPage = plus.webview.currentWebview();
	        }
	        if (targetPage == activePage) {
	          return;
	        }
	        //底部选项卡切换
	        util.toggleNview(currIndex);
	        // 子页面切换
	        util.changeSubpage(targetPage, activePage, aniShow);
	        //更新当前活跃的页面
	        activePage = targetPage;
	      }
	      //防止重复创建页面
	      if (!plus.webview.getWebviewById(subpagesId[currIndex - 1])) {
	        let sub = plus.webview.create(
	          subpages[currIndex - 1],
	          subpagesId[currIndex - 1],
	          subpage_style
	        );
	        //初始化隐藏
	        sub.hide();
	        // append到当前父webview
	        self.append(sub);
	        show();
	      } else {
	        show();
	      }
	    });
  	}
  }
};
</script>

<style lang="less">
</style>
