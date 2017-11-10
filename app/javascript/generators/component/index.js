const componentExists = require('../utils/componentExists');

const path = '../components/';
const indexTemplate = './templates/index.js.hbs';
const indexConnectedTemplate = './templates/index-connected.js.hbs';
const componentTemplate = './templates/component.jsx.hbs';
const stylesTemplate = './templates/styles.scss.hbs';
const actionsTemplate = './templates/actions.js.hbs';
const reducersTemplate = './templates/reducers.js.hbs';
const selectorsTemplate = './templates/selectors.js.hbs';

module.exports = {
  description: 'Component generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Give me a name',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component with the same name already exists'
            : true;
        }

        return 'The name is required';
      }
    },
    {
      type: 'list',
      name: 'redux',
      message: 'Am I connected to redux?',
      choices: ['Yes', 'No']
    }
  ],
  actions: data => {
    const isReduxConnected = data.redux === 'Yes';
    const actions = [
      {
        type: 'add',
        path: `${path}/{{kebabCase name}}/{{kebabCase name}}.js`,
        templateFile: isReduxConnected ? indexConnectedTemplate : indexTemplate,
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
      }
    ];
    if (isReduxConnected) {
      actions.push({
        type: 'add',
        path: `${path}/{{kebabCase name}}/{{kebabCase name}}-actions.js`,
        templateFile: actionsTemplate,
        abortOnFail: true
      });
      actions.push({
        type: 'add',
        path: `${path}/{{kebabCase name}}/{{kebabCase name}}-reducers.js`,
        templateFile: reducersTemplate,
        abortOnFail: true
      });
      actions.push({
        type: 'add',
        path: `${path}/{{kebabCase name}}/{{kebabCase name}}-selectors.js`,
        templateFile: selectorsTemplate,
        abortOnFail: true
      });
    }
    return actions;
  }
};
