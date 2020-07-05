const TerserPlugin = require('terser-webpack-plugin')

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


module.exports = {
  productionSourceMap: true,
  publicPath: './',
  configureWebpack: config => {
    let plugins = [
      // new TerserPlugin({
      //   terserOptions: {
      //     compress: {
      //       warnings: false,
      //       drop_debugger: false,
      //       drop_console: false,
      //     },
      //   },
      //   sourceMap: true,
      //   parallel: true,
      // }),
      new MonacoWebpackPlugin()
    ]
    config.performance= {
      hints: 'warning',
        //入口起点的最大体积 整数类型（以字节为单位）
        maxEntrypointSize: 50000000,
          //生成文件的最大体积 整数类型（以字节为单位 300k）
          maxAssetSize: 50000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
              return assetFilename.endsWith('.js');
            }
    }
    // let moPlugins = [ss
    //   new MonacoWebpackPlugin()
    // ]
    console.log("env:",process.env.NODE_ENV)
    // if (process.env.NODE_ENV !== 'development') {
    //   config.plugins = [...config.plugins, ...plugins, ...moPlugins]
    // }
    config.plugins = [...config.plugins, ...plugins]
    
    // config.plugins = [...config.plugins, ...moPlugins]
  }
}