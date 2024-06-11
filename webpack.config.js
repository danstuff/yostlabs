const path = require('path');
const Pug = require('pug-plugin');

module.exports = {
  mode: 'development',
  entry: './src/assets/main.js',
  plugins: [
    new Pug({
      pretty: 'auto', // format HTML in dev mode
      entry: {
        index: './src/index.pug',
        crafts: './src/crafts.pug',
        about: './src/about.pug',
      },
      js: {
        filename: './assets/[name].js'
      },
      css: {
        filename: './assets/[name].css'
      },
    }),
  ],
  output: {
    filename: "./assets/[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '',
    assetModuleFilename: (pathData) => {
      const filepath = path
        .dirname(pathData.filename)
        .split("/")
        .slice(1)
        .join("/");
      return `${filepath}/[name][ext][query]`;
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
        options: {
          import: true,
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
};
