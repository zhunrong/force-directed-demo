const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = env => {
  return {
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: 'main.js'
    },
    devServer: {
      contentBase: './docs',
      open: true
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './template.ejs'
      })
    ]
  }
}
