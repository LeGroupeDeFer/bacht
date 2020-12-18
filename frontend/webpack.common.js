const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
	entry: ["./src/js/index.js", "./src/scss/main.scss"],
	output: {
		path: path.resolve(__dirname, "static"),
		publicPath: "/",
		filename: "js/bundle.js"
	},
	resolve: {
		extensions: ['.js', '.scss', '.jsx', '.css', '.sass'],
		alias: {
			sharea : path.resolve(__dirname, "src/js")
		}
	},
  module: {
    rules: [
      {
        test:/\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      },
      {
        test:/\.(s(a|c)|c)ss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test:/\.svg$/i,
        exclude: /node_modules/,
        use: ["@svgr/webpack"]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin({
    filename: "css/[name].css", 
    chunkFilename: "[id].css"
  })]
};


