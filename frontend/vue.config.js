const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DEV_SERVER = process.env.DEV_SERVER || 'http://127.0.0.1:8080';
const STATIC_URL_PREFIX = process.env.PROD_STATIC_URL || '/static/';

console.log('process.env.DEV_SERVER',  process.env.DEV_SERVER);
console.log('process.env.PROD_STATIC_URL', process.env.PROD_STATIC_URL);
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('STATIC_URL_PREFIX', STATIC_URL_PREFIX);
console.log('DEV_SERVER', DEV_SERVER);

let setup = {
  outputDir: path.join(__dirname, '..', 'static'),

  css: {
    loaderOptions: {
      sass: {
        includePaths: [path.join(__dirname, 'src')]
      }
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  // disable hashes in filenames
  setup.publicPath = STATIC_URL_PREFIX;
  setup.css.loaderOptions.sass.data = "$static-path: '" + STATIC_URL_PREFIX + "';";
  setup.filenameHashing = false;
  setup.chainWebpack = function(config) {
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  };
  setup.configureWebpack = {
    plugins: [new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    })]
  };
  setup.runtimeCompiler = true;
}
else {
  setup.runtimeCompiler = true;
  setup.publicPath = DEV_SERVER + '/';
  setup.css.loaderOptions.sass.data = "$static-path:'" + DEV_SERVER + "';";
}

module.exports = setup;
