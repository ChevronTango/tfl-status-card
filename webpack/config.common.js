const path = require("path");

module.exports = {
  entry: "./src/index.js",
  devtool: "source-map",
  output: {
    filename: "tfl-status-card.js",
    path: path.resolve(__dirname, "../dist"),
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [/node_modules(?:\/|\\)lit-element|lit-html/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};