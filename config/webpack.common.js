const path = require('path')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')

module.exports = {
  entry: {
    form: path.resolve(__dirname, '../src/js/contact-form.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    // libraryTarget: 'umd', // 打成库的时候, 需要
  },
  resolve: { // 配置模块如何被解析
    alias: { // 简化import / require路径, 设置别名
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.js', '.ts', '.tsx', 'json'],
    modules: [path.resolve(__dirname, '../node_modules')],
  },
  externals: {
    // 把某些库标记为从外部引入, 可以通过script引进来, 使用cdn等网络脚本, 它不打包进bundle中
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 1000 * 1000 * 5, // 5M
    maxAssetSize: 1000 * 1000 * 1,
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        include: path.resolve(__dirname, '../src'), 
        exclude: /node_modules/, 
        use: 'babel-loader?cacheDirectory',
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '../src'), 
        exclude: /node_modules/, 
        use: [
          'babel-loader?cacheDirectory',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: false,
            },
          }
        ],
      },
      // https://github.com/webpack-contrib/css-loader
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   use: ['style-loader', 'css-loader', 'postcss-loader'], // MiniCssExtractPlugin.loader
      // },
      {
        test: /\.(sa|sc|c)ss$/, // test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        // pictures
        test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader', // https://github.com/webpack-contrib/file-loader
                options: {
                  name: '[name].[ext]',
                  outputPath(url) { // 对应格式的图片,输出到对应的文件夹下
                    let imgPath = 'img'
                    if (String.prototype.includes.call(url, '.')) {
                      const arr = new String(url).split('.')
                      return `${imgPath}/${arr[arr.length - 1]}/${url}`
                    }
                    return `${imgPath}/${url}`
                  },
                },
              },
            },
          }
        ],
      },
      {
        // vedio
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:8].[ext]',
                  outputPath: 'media/',
                },
              },
            },
          }
        ],
      },
      {
        // 字体
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]',
                },
              },
            },
          }
        ],
      }
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.ProvidePlugin({ // 自动加载模块，而不必到处 import 或 require; 相当于一个全局变量形式
      // _$: 'jquery',
    }),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
      // handler(percentage, message, ...args) {
      //   console.info('进度: %s, 消息: %s, 参数: %s', percentage, message, [...args].join(' | '))
      // },
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist'),
        ignore: ['index.html'],
        toType: 'dir',
        force: true,
      }
    ]),
    new HtmlWebpackPlugin({
      entry: path.resolve(__dirname, '../src/js/contact-form.js'),
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      inject: true,
      title: '请修改webpack.common.js中的title',
      favicon: path.resolve(__dirname, '../public/favicon.ico'), // 图标
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      // chunks: '',  // 多页面的时候有用, 用来引入对应的chunk进来; 单页面没用
      chunksSortMode: 'dependency',
    }),
    new PreloadWebpackPlugin(
      {
        rel: 'preload', // 碰到了就预加载, 但不执行
        include: 'initial',
      }
    ),
    new PreloadWebpackPlugin(
      {
        rel: 'prefetch', // 空闲的时候去下载
        include: 'asyncChunks',
      }
    )
  ],
}
