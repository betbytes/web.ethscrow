const path = require('path');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = function override(config, env) {
  const wasmExtensionRegExp = /\.wasm$/;

  config.plugins.push(new AddAssetHtmlPlugin({ filepath: require.resolve('./src/utils/wasm/init_go.js') }));
  config.plugins.push(new AddAssetHtmlPlugin({ filepath: require.resolve('./src/utils/wasm/wasm_exec.js') }));

  config.resolve.extensions.push('.wasm');

  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        // make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  // add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, 'src'),
    use: [{ loader: require.resolve('wasm-loader'), options: {} }]
  });

  return config;
};