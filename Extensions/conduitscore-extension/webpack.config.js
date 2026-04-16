// webpack.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => ({
  mode: env.production ? 'production' : 'development',
  devtool: env.production ? false : 'cheap-module-source-map',

  entry: {
    // Three separate bundles — Chrome loads each independently
    'service-worker': './src/background/service-worker.ts',
    'popup': './src/popup/index.tsx',
    'content-script': './src/content/content-script.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'public/popup.html', to: 'popup.html' },
        { from: 'public/icons', to: 'icons' },
      ],
    }),
  ],
});
