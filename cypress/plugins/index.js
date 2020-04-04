const { audit, prepareAudit } = require('cypress-audit');

module.exports = (on) => {
  on('task', require('@cypress/code-coverage/task'));
  on('before:browser:launch', (browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
  });

  on('task', {
    audit,
  });
};
