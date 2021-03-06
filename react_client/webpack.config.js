var config = require('config')
var path = require('path')
var webpack = require('webpack')
// var AssetsPlugin = require('assets-webpack-plugin')

var requestSampleData = require('./config/offline').requestSampleData;
requestSampleData(config);

var debugMode = !(process.env.NODE_ENV === 'production')

var config = {
  devtool: debugMode ? 'cheap-module-eval-source-map' : false,
  entry: {
    app: './app/app',
    vendor: [
      'react',
      'react-router',
      'redux',
      'react-dom',
      'bluebird',
      'fielddb',
      'history'
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.join(__dirname, 'app'), 'node_modules']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'API_BASE_URL'])
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
}


if (debugMode) {
  config.entry.dev = [
    'webpack-dev-server/client?https://localhost:3001',
    'webpack/hot/only-dev-server',
  ]

  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filname: 'vendor.js'
    })
  ])
  config.output.publicPath = 'https://localhost:3001/static/'
  config.module.rules[0].options = {
    "env": {
      "development": {
        "presets": ["react-hmre"]
      }
    }
  }
} else {
  config.plugins = config.plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filname: '[name].[chunkhash].js'
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ])
}

module.exports = config
