const { env, publicPath } = require('../configuration.js');

module.exports = {
  test: /\.(jpg|jpeg|png|gif|eot|ttf|woff|woff2)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        publicPath,
        name:
          env.RAILS_ENV === 'production'
            ? '[name]-[hash].[ext]'
            : '[name].[ext]'
      }
    }
  ]
};
