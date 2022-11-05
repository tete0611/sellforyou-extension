require('dotenv').config({ path: './.env' });

var webpack = require('webpack');
var path = require('path');
var fileSystem = require('fs-extra');
var env = require('./utils/env');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');

var { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

var alias = {
  'react-dom': '@hot-loader/react-dom',
};

var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');
var fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

var options = {
  mode: process.env.NODE_ENV || 'development',

  entry: {
    app: path.join(__dirname, 'src', 'pages', 'Main', 'index.jsx'),
    signin: path.join(__dirname, 'src', 'pages', 'Main', 'SignIn', 'index.jsx'),
    signup: path.join(__dirname, 'src', 'pages', 'Main', 'SignUp', 'index.jsx'),
    dashboard: path.join(__dirname, 'src', 'pages', 'Main', 'Dashboard', 'index.jsx'),
    collected: path.join(__dirname, 'src', 'pages', 'Main', 'Product', 'Collected', 'index.jsx'),
    analysis: path.join(__dirname, 'src', 'pages', 'Main', 'Keyword', 'Analysis', 'index.jsx'),
    reference: path.join(__dirname, 'src', 'pages', 'Main', 'Keyword', 'Reference', 'index.jsx'),
    registered: path.join(__dirname, 'src', 'pages', 'Main', 'Product', 'Registered', 'index.jsx'),
    new: path.join(__dirname, 'src', 'pages', 'Main', 'Order', 'New', 'index.jsx'),
    delivery: path.join(__dirname, 'src', 'pages', 'Main', 'Order', 'Delivery', 'index.jsx'),
    banwords: path.join(__dirname, 'src', 'pages', 'Main', 'BanWords', 'index.jsx'),
    settings: path.join(__dirname, 'src', 'pages', 'Main', 'Settings', 'index.jsx'),
    sourcing: path.join(__dirname, 'src', 'pages', 'Main', 'Sourcing', 'index.jsx'),
    connects: path.join(__dirname, 'src', 'pages', 'Main', 'Connects', 'index.jsx'),
    popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.jsx'),
    background: path.join(__dirname, 'src', 'pages', 'Background', 'index.ts'),
    contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.ts'),
    trangers: path.join(__dirname, 'src', 'pages', 'Trangers', 'trangers.ts'),
  },

  chromeExtensionBoilerplate: {
    notHotReload: ['background', 'contentScript', 'devtools'],
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: ASSET_PATH,
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,

        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',

            options: {
              sourceMap: true,
            },
          },
        ],
      },

      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },

      {
        test: /\.(js|jsx)$/,

        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],

        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    alias: alias,

    fallback: {
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer"),
      "timers": require.resolve("timers-browserify"),
      "crypto": false
    },

    extensions: fileExtensions.map((extension) => '.' + extension).concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },

  plugins: [
    new CleanWebpackPlugin({ verbose: false }),

    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env)
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'build'),
          force: true,
          transform: function (content, path) {
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/pages/Trangers/trangers.css',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/pages/Trangers/trangers_single.html',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/pages/Trangers/trangers_multiple.html',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/pages/Content/content.styles.css',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/**',
          to: 'resources/[name].[ext]',
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'ui/**',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/img/icon.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/img/icon16.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/img/icon48.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/img/icon128.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'index.html'),
      filename: 'app.html',
      chunks: ['app'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'SignIn', 'index.html'),
      filename: 'signin.html',
      chunks: ['signin'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'SignUp', 'index.html'),
      filename: 'signup.html',
      chunks: ['signup'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Dashboard', 'index.html'),
      filename: 'dashboard.html',
      chunks: ['dashboard'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Product', 'Collected', 'index.html'),
      filename: 'product/collected.html',
      chunks: ['collected'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Keyword', 'Analysis', 'index.html'),
      filename: 'keyword/analysis.html',
      chunks: ['analysis'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Keyword', 'Reference', 'index.html'),
      filename: 'keyword/reference.html',
      chunks: ['reference'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Product', 'Registered', 'index.html'),
      filename: 'product/registered.html',
      chunks: ['registered'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Order', 'New', 'index.html'),
      filename: 'order/new.html',
      chunks: ['new'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Order', 'Delivery', 'index.html'),
      filename: 'order/delivery.html',
      chunks: ['delivery'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'BanWords', 'index.html'),
      filename: 'banwords.html',
      chunks: ['banwords'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Settings', 'index.html'),
      filename: 'settings.html',
      chunks: ['settings'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Sourcing', 'index.html'),
      filename: 'sourcing.html',
      chunks: ['sourcing'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Main', 'Connects', 'index.html'),
      filename: 'connects.html',
      chunks: ['connects'],
      cache: false,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
    }),
  ],

  infrastructureLogging: {
    level: 'info',
  },
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-source-map';
} else {
  options.optimization = {
    minimize: true,

    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
