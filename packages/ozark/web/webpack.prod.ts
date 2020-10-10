import { merge } from 'webpack-merge'
import { common } from './webpack.common'

export = merge(common, {
  mode: 'production',
})
