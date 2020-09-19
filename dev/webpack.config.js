const path = require(`path`),
  merge = require(`webpack-merge`),
  parts = require(`./webpack.parts`),
  webpack = require(`webpack`);

// include the js minification plugin
const TerserPlugin = require("terser-webpack-plugin");

// include the css extraction and minification plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminJpegRecompress = require("imagemin-jpeg-recompress");

const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, `src`),
  dist: path.join(__dirname, `dist`),
};

const commonConfig = {
  entry: [
    path.join(PATHS.src, `js/script.js`),
    path.join(PATHS.src, `css/style.scss`),
  ],
  output: {
    path: path.resolve(__dirname),
    filename: "../js/script.min.[hash].js",
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|webp|svg)$/,
        use: [
          {
            loader: `file-loader`,
            options: {
              limit: 1000,
              context: `./src`,
              name: `[path][name].[ext]`,
            },
          },
          {
            loader: `image-webpack-loader`,
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [`babel-loader`],
      },
      {
        test: /\.(woff|woff2)$/,
        loader: `url-loader`,
        options: {
          limit: 1000,
          context: `./src`,
          name: `[path][name].[ext]`,
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Promise: "es6-promise",
      fetch:
        "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch",
    }),
    // clean out build directories on each build
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["../js/*", "../css/*"],
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    new MiniCssExtractPlugin({
      filename: `../css/main.min.[hash].css`,
    }),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: "localhost",
      port: 3000,
      files: ["../css/*.css", "../js/*.js", "../*.php"],
      proxy: `http://localhost/${__dirname.split("/")[4]}/`,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // enable the js minification plugin
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
      }),
      // enable the css minification plugin
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};

const productionConfig = merge([
  {
    plugins: [
      new ImageminPlugin({
        test: /\.(jpe?g)$/i,
        plugins: [imageminJpegRecompress({})],
      }),
    ],
  },
]);

const developmentConfig = merge([
  {
    devServer: {
      overlay: true,
      contentBase: PATHS.src,
    },
  },
]);

module.exports = () => {
  if (process.env.NODE_ENV === "production") {
    console.log("building production");
    return merge(commonConfig, productionConfig);
  }
  return merge(commonConfig, developmentConfig);
};
