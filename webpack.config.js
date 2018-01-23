// 读取package.json 文件
const pkg = require('./package.json');
const Path = require('path');
require("babel-polyfill");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');




// 区分环境   通过 NODE_ENV 进行区分

const env = {
  // 输出主路径
  path:'./',
  // 资源cdn路径
  publicPath:'/',
  // 输出外部css文件路径
  cssFileName:'',
  // 输出外部js文件路径
  jsFileName:'',
  // 输出外部img文件路径
  imgFileName:'',
  // 输出外部img文件路径
  fontFileName:'',
  // 输出外部html文件路径
  htmlFileName:'',
  // cdn 地址
  cdnHost:'/',
  // 第三发依赖的环境名称 //  development  or  production.min
  lib_env:'development'
}

switch (process.env.NODE_ENV) {
  // 本地开发环境
  case'development':
    env.path = './dist';
    env.publicPath = '/';
    env.cssFileName = 'stylesheet/[name].css';
    env.jsFileName = 'javascript/[name].js';
    env.imgFileName = 'images/[name].[ext]';
    env.htmlFileName = 'index.html';
    env.cdnHost = 'https://st.lingtouniao.com';
    env.lib_env = 'development';
    break;
  // 测试环境，内部网
  case'test':
    env.path = `./dist/public/${pkg.version}`;
    env.publicPath = `https://st.lingtouniao.com/${pkg.name}/${pkg.version}/`;
    env.cssFileName = 'stylesheet/[name].css';
    env.jsFileName = 'javascript/[name].js';
    env.imgFileName = 'images/[name].[ext]';
    env.htmlFileName = '../../html/index.html';
    env.cdnHost = 'https://st.lingtouniao.com';
    env.lib_env = 'production';
    break;
  // 线上生产环境
  case'production':
    break;
  default:
    throw new Error('环境参数不正确')
}

console.log(env);


const extractSCSS = new ExtractTextPlugin({
  filename: env.cssFileName,
  allChunks:true
});

const html = new HtmlWebpackPlugin({
  cdnHost:env.cdnHost,
  lib_env:env.lib_env,
  template: Path.resolve(__dirname, './src/index.ejs'),
  filename:env.htmlFileName
});

module.exports = {
  entry: ["babel-polyfill", "./src/app.jsx"],
  // entry:{
  //   main:'./src/app.jsx'
  // },
  output: {
    path: Path.resolve(__dirname,env.path),
    filename: env.jsFileName,
    chunkFilename: env.jsFileName,
    publicPath:env.publicPath
  },
  module:{
    rules:[
      // 解析jsx
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          babelrc: false,
          compact: false,
          presets: [
            'env',
            'react',
            'stage-2',
          ],
        }
      },
      // 解析scss
      {
        test: /\.(scss|css)$/,
        use: extractSCSS.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }, {
            loader: 'postcss-loader',
          }, {
            loader: 'sass-loader',
            options:{
              data: '$cdnHost: '+`"${env.cdnHost}"`+' ;'// 这个地方处理，scss中需要访问cdn资源的主域名
            }
          }],
        }),
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{
          loader:'url-loader',
          options:{
            limit:1000,
            name:env.imgFileName
            // outputPath:'imgs/'
          }
        }]
      }
    ]
  },
  externals:{
    'react':'React',
    'react-dom':'ReactDOM'
  },
  resolve: {
    modules: [
      'node_modules',
      Path.resolve(__dirname, './src'),
    ],
    extensions: ['.js', '.json', '.jsx', '.css','.scss'],
  },
  plugins:[
    html,
    extractSCSS
  ],
  devServer: {
    port: 3000,
    // historyApiFallback: true,
    noInfo: false,
    // stats: 'minimal',
    // contentBase: Path.join(__dirname, '../public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    // hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    headers:{
      "X-Custom-Foo": "bar"
    },
    proxy: {
      '/devcdn':{
        changeOrigin: true,
        target: 'https://s1.lingtouniao.com',
        pathRewrite: { '^/devcdn': '' },
        // onProxyRes:(proxyRes, req, res)=>{
        //   // proxyRes.headers['referer'] = 'http://www.lingtouniao.com';
        // },
        onProxyReq:(proxyReq, req, res)=>{
          proxyReq.setHeader('referer', 'http://www.lingtouniao.com');
        }
      },
      '/v3': {
        changeOrigin: true,
        // target: 'https://www.lingtouniao.com',
        target: 'http://192.168.18.194:8080',
        // pathRewrite: { '^/v3': '' }
      },
      // '/api': {
      //   changeOrigin: true,
      //   // target: 'https://www.lingtouniao.com',
      //   // target: 'http://192.168.18.194:1950',
      //   // target: 'http://192.168.18.195:8082',
      //   target: 'http://192.168.18.196:8082',
      //   pathRewrite: { '^/api': '' },
      // }
    },
  }
};
