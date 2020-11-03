import path from 'path';
import webpack from 'webpack';

export default {
  context: path.resolve(__dirname, 'src'),
  entry: './client/index.jsx',

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: "/public/",
    filename: path.join('public', 'js', 'bundle.js')
  },

  devtool: 'source-map',

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      options: {
            presets: ['env', 'react', 'es2015'],
            plugins: ['transform-class-properties']
        }
    }]
  }
};
