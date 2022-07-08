const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getFile = (fileName) => path.resolve(__dirname, `../src/${fileName}.ts`);
const getOptionFiles = (fileNames) =>
	fileNames.map((fileName) =>
		path.resolve(__dirname, `../src/options/scripts/${fileName}.ts`)
	);

module.exports = {
	mode: "production",
	entry: {
		background: getFile("background"),
		index: getFile("base/index"),
		"popup/popup": getFile("popup/popup"),
		"options/options": getOptionFiles([
			"index",
			"add-site",
			"tab",
			"time-form",
			"load-options",
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
