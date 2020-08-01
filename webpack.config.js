// Webpack uses this to work with directories
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// This is the main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

  // Path to your entry point. From this file Webpack will begin his work
  entry: './src/javascript/app.js',
  devtool: 'inline-source-map',
  
  devServer: {
    contentBase: './dist'
  },
  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript 
  // minifying and other thing so let's set mode to development
  mode: 'development',

  module : {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
        },
        {
            test: /\.js$/,
            /* ... */
          },
          {
            // Apply rule for .sass, .scss or .css files
            test: /\.(sa|sc|c)ss$/,
      
            // Set loaders to transform files.
            // Loaders are applying from right to left(!)
            // The first loader will be applied after others
            use: [
                {
                    // After all CSS loaders we use plugin to do his work.
                    // It gets all transformed CSS and extracts it into separate
                    // single bundled file
                    loader: MiniCssExtractPlugin.loader
                  }, 
                   {
                     // This loader resolves url() and @imports inside CSS
                     loader: "css-loader",
                   },
                   {
                     // Then we apply postCSS fixes like autoprefixer and minifying
                     loader: "postcss-loader"
                   },
                   {
                     // First we transform SASS to standard CSS
                     loader: "sass-loader",
                     options: {
                       implementation: require("sass")
                     }
                   }
                 ]
          },
          {
            // Now we apply rule for images
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
                   {
                     // Using file-loader for these files
                     loader: "file-loader",
      
                     // In options we can set different things like format
                     // and directory to save
                     options: {
                       outputPath: 'images'
                     }
                   }
                 ]
          },{
            test: /\.(woff|woff2|ttf|otf|eot)$/,
            use: [
              {
                loader: "file-loader",
                options: {
                  outputPath: "fonts"
                }
              }
            ]
          },
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      chunks: ['index'],
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ["popper.js", "default"]
    }),
  ]
};
