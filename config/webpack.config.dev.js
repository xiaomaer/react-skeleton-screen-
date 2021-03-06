const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin'); //webpack日志面板
const PrerenderSpaPlugin = require('prerender-spa-plugin'); //预渲染
const baseWebpackConfig = require('./webpack.config.base');

module.exports = merge(baseWebpackConfig, {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 9999,
    historyApiFallback: true,
    hot: true,
    inline: true,
    quiet: true,
    publicPath: '/',
  },
  module: {
    rules: [{
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            }
          },
          'postcss-loader',
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            }
          },
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            }
          },
          'postcss-loader',
          'less-loader',
        ]
      }
    ]
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      template: path.resolve('public/index.html'),
      inject: true
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }.
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    }),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // build logs
    new DashboardPlugin(),
    // prerender page
    new PrerenderSpaPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname,'..', 'dist'),
      // Required - Routes to render.
      routes: ['/skeleton/preredner'],
    }),
  ]
})
