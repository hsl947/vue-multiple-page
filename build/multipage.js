const fs = require("fs");
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin-for-multihtml");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const config = require("../config");
// 通过页面配置文件过去页面json
function generateByConfig() {
  return JSON.parse(fs.readFileSync("./src/page.json"));
}

// 生成extraEntry
const extraEntry = generateByConfig();

let newExtraEntry = {};

// 生成HtmlWebpackPlugin
let extraHtmlWebpackPlugins = [];
//let haveMui = false;
for (let i in extraEntry) {
  // 配置是否使用plusready
  const usePlusReady = /\S+\|plusReady/.test(i);
  let chunk = i;
  // 如果用了mui就要导入mui资源
//useMui && haveMui++;
  // 提前加载plus
  if (usePlusReady) chunk = chunk.replace("|plusReady", "");
  newExtraEntry[chunk] = extraEntry[i];
  extraHtmlWebpackPlugins.push(
    new HtmlWebpackPlugin({
      filename: chunk + ".html",
      template: "index.html",
      multihtmlCache: true,
      chunks: [chunk, 'vue'],
      plusReady: usePlusReady ? '<script src="html5plus://ready"></script>' : ""
      // 获取mui的script
    })
  );
}

exports.extraEntry = newExtraEntry;
exports.extraHtmlWebpackPlugins = extraHtmlWebpackPlugins;
