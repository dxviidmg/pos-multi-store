const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fullySpecified = false;
  return config;
};
