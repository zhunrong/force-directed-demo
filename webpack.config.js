const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = env => {
  const commonPlugins = [
    new HtmlWebpackPlugin({
      template: './template.ejs'
    })
  ]
  let plugins
  if (env.production) {
    plugins = [
      new CleanWebpackPlugin(),
      ...commonPlugins
    ]
  } else {
    plugins = [...commonPlugins]
  }
  return {
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: 'main@[contenthash].js'
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
    plugins
  }
}
