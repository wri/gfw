const componentExists = require('../utils/componentExists');

const path = '../pages/';
const indexConnectedTemplate = './templates/index-connected.js.hbs';
const componentTemplate = './templates/component.jsx.hbs';
const stylesTemplate = './templates/styles.scss.hbs';
const actionsTemplate = './templates/actions.js.hbs';
const reducersTemplate = './templates/reducers.js.hbs';
const selectorsTemplate = './templates/selectors.js.hbs';

module.exports = {
  description: 'Page component generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Give me a page name',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A page with the same name already exists'
            : true;
        }

        return 'The name is required';
      }
    }
  ],
  actions: [
    {
      type: 'add',
      path: `${path}/{{kebabCase name}}/{{kebabCase name}}.js`,
      templateFile: indexConnectedTemplate,
      abortOnFail: true
    },
    {
      type: 'add',
      path: `${path}/{{kebabCase name}}/{{kebabCase name}}-component.jsx`,
      templateFile: componentTemplate,
      abortOnFail: true
    },
    {
      type: 'add',
      path: `${path}/{{kebabCase name}}/{{kebabCase name}}-styles.scss`,
      templateFile: stylesTemplate,
      abortOnFail: true
    },
    {
      type: 'add',
      path: `${path}/{{kebabCase name}}/{{kebabCase name}}-actions.js`,
      templateFile: actionsTemplate,
      abortOnFail: true
    },
    {
      type: 'add',
      path: `${path}/{{kebabCase name}}/{{kebabCase name}}-reducers.js`,
      templateFile: reducersTemplate,
      abortOnFail: true
    },
    {
      type: 'add',
      path: `${path}/{{kebabCase name}}/{{kebabCase name}}-selectors.js`,
      templateFile: selectorsTemplate,
      abortOnFail: true
    }
  ]
};
