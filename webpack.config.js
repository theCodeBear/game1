var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/builds/src'
  },
  plugins: [
    HtmlWebpackPluginConfig
  ]
};
