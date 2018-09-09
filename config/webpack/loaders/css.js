module.exports = {
  test: /\.(css)$/i,
  use: [{ loader: 'style-loader' }, { loader: 'raw-loader' }],
  include: /node_modules/
};
