module.exports = {
  resolve: {
    alias: {
      'react-native': __dirname +'/fake-react-native.js',
      'react': __dirname + '/fake-react.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
