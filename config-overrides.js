module.exports = function override(config) {
  config.resolve.fullySpecified = false;
  // @zxing/browser publica source maps que apuntan a archivos .ts que no se incluyen en el paquete
  config.ignoreWarnings = [...(config.ignoreWarnings || []), /Failed to parse source map/];
  return config;
};
