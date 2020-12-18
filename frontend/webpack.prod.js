const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");
const BrotliPlugin = require("brotli-webpack-plugin");


module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new BrotliPlugin({
      asset: "[path].br[query]",
      test: /\.(js)|(css)|(svg)|(html)$/i,
      threshold: 10240,
      minRatio: 0.8
    }),
    ...common.plugins
  ]
});
