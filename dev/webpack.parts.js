const ExtractTextPlugin = require("extract-text-webpack-plugin");

exports.extractCSS = () => {
  const extractCSS = new ExtractTextPlugin({
    filename: "css/style.css",
  });

  return {
    plugins: [extractCSS],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: extractCSS.extract({
            use: [`css-loader`, "postcss-loader", `sass-loader`],
            publicPath: "../",
          }),
        },
      ],
    },
  };
};
