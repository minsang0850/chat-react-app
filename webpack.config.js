const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  entry: './src/index.js', // 엔트리 파일 경로
  output: {
    path: path.resolve(__dirname, 'dist'), // 번들 파일이 생성될 경로
    filename: 'bundle.js', // 번들 파일의 이름
  },
  resolve: {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "os": false,
      "crypto": false,
      "crypto-browserify": require.resolve('crypto-browserify')
    }
  },
  plugins: [new NodePolyfillPlugin()],
  module: {
    rules: [
      // 로더 설정
      // 예: Babel 로더
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // {
      //   test: /stompjs/,
      //   loader: 'imports-loader',
      //   options: {
      //     imports: ['default sockjs']
      //   }
      // },
      {
        test: /stomp\.umd\.js$/,
        use: [
          {
            loader: 'script-loader',
            options: {
              useStrict: false,
              type: 'text/javascript',
            },
          },
        ],
      }
    ],
  },
};
