const componentGenerator = require('./component');
const pageGenerator = require('./page');

module.exports = plop => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('page', pageGenerator);
};
