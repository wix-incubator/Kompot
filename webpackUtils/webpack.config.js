module.exports = {
  output: {
      path: __dirname
      },
  resolve: {
    alias: {
      'react-native': './fake-react-native',
      'react': './fake-react'
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
