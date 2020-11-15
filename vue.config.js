"use strict";
const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

// externals中进行声明，key为引入的包名，value为全局变量名
const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  axios: "axios",
  "element-ui": "ELEMENT"
};
const cdnurl = "http://bim.checc.com.cn/baisha/staticfile/";
const cdn = {
  dev: {
    css: [],
    js: []
  },
  build: {
    css: [cdnurl + "element/index.css"],
    js: [
      cdnurl + "vue/vue.min.js",
      cdnurl + "vue/vue-router.min.js",
      cdnurl + "vue/vuex.min.js",
      cdnurl + "axios/axios.min.js",
      cdnurl + "element/index.js"
    ]
  }
};
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to '/bar/'.
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: isProduction ? "/SQInspectionSystem/" : "/",
  outputDir: "SQInspectionSystem",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      //   管理系统
      "/safety/": {
        target: "http://bim.checc.com.cn/",
        changeOrigin: true,
        pathRewrite: {
          "^/safety": "/safety/"
        }
      },
      //   管理系统
      "/openapi/": {
        target: "http://bim.checc.com.cn/",
        changeOrigin: true,
        pathRewrite: {
          "^/openapi": "/openapi/"
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: config => {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.name = '我的博客';
    config.resolve.alias = { "@": resolve("src") };
    const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
    if (isProduction) {
      Object.assign(config, {
        externals: externals
      });
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ["console.log"]
            },
            output: {
              comments: false
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
      config.plugins.push(
        new CompressionWebpackPlugin({
          // 配置参数详解
          // asset： 目标资源名称。 [file] 会被替换成原始资源。[path] 会被替换成原始资源的路径， [query] 会被替换成查询字符串。默认值是 "[path].gz[query]"。
          // algorithm： 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
          // test： 所有匹配该正则的资源都会被处理。默认值是全部资源。
          // threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
          // minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      );
      if (process.env.npm_config_report) {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerHost: "127.0.0.1",
            analyzerPort: 8889,
            reportFilename: "report.html",
            defaultSizes: "gzipped",
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: "stats.json",
            statsOptions: null,
            logLevel: "info"
          })
        );
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
    config.plugin("html").tap(args => {
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn.build;
      }
      if (process.env.NODE_ENV === "development") {
        args[0].cdn = cdn.dev;
      }
      return args;
    });
  }
};
