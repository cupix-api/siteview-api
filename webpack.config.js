// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const TerserJSPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    siteView4embed: path.resolve(__dirname, "src/siteView4embed.js"),
    'siteView4embed.min': path.resolve(__dirname, "src/siteView4embed.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({
      include: /\.min\.js$/
    })]
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new CleanWebpackPlugin({}),
    new CopyPlugin({
      patterns: [
        { from: "package.json", to: "package.json" },
        { from: "README.md", to: "README.md" }
      ]
    }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
