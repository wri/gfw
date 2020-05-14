const { env, publicPath } = require('../configuration.js');

module.exports = {
  test: /\.(jpg|jpeg|png|gif|eot|ttf|webp|woff|woff2)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        publicPath,
        name:
          env.NODE_ENV === 'production' ? '[name]-[hash].[ext]' : '[name].[ext]'
      }
    }
  ]
};
