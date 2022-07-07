const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getFile = (...args) => path.resolve(__dirname, "..", "src", ...args);
const getOptionFiles = (fileNames) =>
	fileNames.map((fileName) =>
		path.resolve(__dirname, `../src/options/scripts/${fileName}`)
	);

module.exports = {
	mode: "production",
	devtool: "source-map",
	entry: {
		background: getFile("background.ts"),
		index: getFile("index.ts"),
		"popup/popup": getFile("popup/popup.ts"),
		"options/options": getOptionFiles([
			"index.ts",
			"utils.ts",
			"input.ts",
			"tab.ts",
			"time.ts",
			"timeline.ts",
			"load-sites.ts",
		]),
	},
	output: {
		path: path.join(__dirname, "../dist"),
		filename: "[name].js",
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new CopyPlugin({
			patterns: [
				{ from: ".", to: ".", context: "public" },
				{ from: "src/assets", to: "assets" },
				{ from: "src/options/options.html", to: "options/options.html" },
				{ from: "src/popup/popup.html", to: "popup/popup.html" },
			],
		}),
	],
};
