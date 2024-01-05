// Generated using webpack-cli https://github.com/webpack/webpack-cli
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  mode: "development",
  entry: "/src/siteView4Embed.js",
  output: {
    path: __dirname + "dist",
    filename: "siteView4Embed.js",
    libraryTarget: "umd",
  },
  devServer: {
    open: true,
    host: "localhost",
    hot: true,
    port: 8080,
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './playground/playground.css', to: './playground.css' },
        { from: './playground/playground.js', to: './playground.js' },
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ "css-loader" ]
      }
    ]
  }
}



module.exports = config;