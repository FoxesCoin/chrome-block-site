const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const getFile = (...args) => path.resolve(__dirname, "..", "src", ...args);
const getOptionFiles = (fileNames) =>
	fileNames.map((fileName) =>
		path.resolve(__dirname, `../src/options/scripts/${fileName}`)
	);

module.exports = {
	mode: "production",
	entry: {
		background: getFile("background.ts"),
		index: getFile("index.ts"),
		"popup/popup": getFile("popup/popup.ts"),
		"options/options": getOptionFiles([
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
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: ".", to: ".", context: "public" }],
		}),
		new HtmlWebpackPlugin({
			filename: "options/options.html",
			template: "src/options/options.html",
		}),
		new HtmlWebpackPlugin({
			filename: "popup/popup.html",
			template: "src/popup/popup.html",
		}),
	],
};
