// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const defaultConfig = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
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

const config = {
  ...defaultConfig,
  entry: {
    "umd/siteView4embed": path.resolve(__dirname, "src/siteView4embed.js"),
    "umd/siteView4embed.min": path.resolve(__dirname, "src/siteView4embed.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
  },
  plugins: [],
};

const cjsConfig = {
  ...defaultConfig,
  entry: {
    "cjs/siteView4embed": path.resolve(__dirname, "src/siteView4embed.js"),
    "cjs/siteView4embed.min": path.resolve(__dirname, "src/siteView4embed.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
  },
};

const esmConfig = {
  ...defaultConfig,
  entry: {
    "esm/siteView4embed": path.resolve(__dirname, "src/siteView4embed.js"),
    "esm/siteView4embed.min": path.resolve(__dirname, "src/siteView4embed.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "module",
  },
  experiments: {
    outputModule: true,
  },
};

const configs = [config, cjsConfig, esmConfig];

module.exports = () => {
  configs.forEach((it) => {
    if (isProduction) {
      it.mode = "production";
    } else {
      it.mode = "development";
    }
  });
  return configs;
};
