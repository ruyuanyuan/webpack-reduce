const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // 'eval-source-map',
  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, '../dist'),
    compress: true,
    historyApiFallback: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    disableHostCheck: true,
    index: 'index.html',
    open: true,
    hot: true,
    openPage: 'index',
  },
  plugins: [
    new webpack.DefinePlugin({}), 
    new webpack.HotModuleReplacementPlugin()
  ],
})
