var browser = {
  versions: function () {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return { //移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
//判断：
var and = browser.versions.android; //android
var ios = browser.versions.ios; //ios
var wgtVer = null;

function plusReady() {
  // 获取本地应用资源版本号
  plus.runtime.getProperty(plus.runtime.appid, function (inf) {
    wgtVer = inf.version;
    console.log("当前应用版本：" + wgtVer);
    checkUpdate()
  });
}
if (window.plus) {
  plusReady();
} else {
  document.addEventListener('plusready', plusReady, false);
}

// 检测更新
var checkUrl = '';
if (and) {
  checkUrl = xinjuhao + "/api/index/appversion";
} else if (ios) {
  checkUrl = xinjuhao + "/api/index/appversion";
}

function checkUpdate() {
  //      plus.nativeUI.showWaiting("检测更新...");
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    switch (xhr.readyState) {
      case 4:
        plus.nativeUI.closeWaiting();
        if (xhr.status == 200) {
          console.log("检测更新成功：" + xhr.responseText);
          var returnData = eval('(' + xhr.responseText + ')')
          var newVer = returnData.data.version;
          if (wgtVer && newVer && (wgtVer < newVer)) {
            plus.nativeUI.confirm(
              '发现新版本，是否更新？',
              function (e) {
                if (e.index == 1) {
                  //downWgt(); // 下载升级包
                  if (and) {
                    downWgt(returnData.data.url);
                    //var url='http://app.qq.com/#id=detail&appid=1105872621';
                    //plus.runtime.openURL(url);
                  } else if (ios) {
                    downWgt(returnData.data.url);
                  }
                } else {
                  plus.runtime.quit();
                }
              }, {
                title: '温馨提示',
                buttons: ['取消', '立即下载']
              }
            )
          }
        } else {
          console.log("检测更新失败！");
          //plus.nativeUI.alert("检测更新失败，请重启app应用！");
        }
        break;
      default:
        break;
    }
  }
  xhr.open('POST', checkUrl);
  xhr.send();
}
// 下载wgt文件
//var wgtUrl = "http://xinjuhao.xinjuhao.net/app/update.wgt";

function downWgt(wgtUrl) {
  plus.nativeUI.showWaiting("下载更新文件...");
  plus.downloader.createDownload(wgtUrl, { filename: "_doc/update/" }, function (d, status) {
    if (status == 200) {
      console.log("下载更新文件成功：" + d.filename);
      installWgt(d.filename); // 安装wgt包
    } else {
      console.log("下载更新文件失败！");
      plus.nativeUI.alert("下载更新文件失败！");
    }
    plus.nativeUI.closeWaiting();
  }).start();
}
// 更新应用资源
function installWgt(path) {
  plus.nativeUI.showWaiting("安装wgt文件...");
  plus.runtime.install(path, {}, function () {
    plus.nativeUI.closeWaiting();
    console.log("安装wgt文件成功！");
    plus.nativeUI.alert("应用资源更新完成！", function () {
      plus.runtime.restart();
    });
  }, function (e) {
    plus.nativeUI.closeWaiting();
    console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
    plus.nativeUI.alert("安装更新文件失败[" + e.code + "]：" + e.message);
  });
}
