import { merge } from 'webpack-merge'
import * as path from 'path'
import { common } from './webpack.common'

export = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    overlay: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
      },
    },
  },
})
