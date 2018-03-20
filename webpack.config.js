const path = require('path');

module.exports = {
  entry: [
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.resolve(__dirname, "dist"), 
    filename: 'react-flux-dash.js',
    library: 'react-flux-dash',
    libraryTarget: 'umd'
  },
  externals: {
    flux: {
      commonjs: 'flux',
      commonjs2: 'flux',
      amd: 'flux',
      root: 'flux'
    },
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'react'
    }
  },
  devServer: {
    contentBase: './dist'
  }
};