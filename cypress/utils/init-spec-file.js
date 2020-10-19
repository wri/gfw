const asSlug = s => s.trim().toLowerCase().replace(/\s/g, '_');
function initSpec(title, testConfig) {
  describe(title, () => {
    const xhrData = [];

    after(() => {
      // In record mode, save gathered XHR data to local JSON file
      if (Cypress.env('RECORD')) {
        const path = `./cypress/fixtures/${asSlug(title)}.json`;
        cy.writeFile(path, xhrData);
      }
    });

    beforeEach(() => {
      cy.server({
        onResponse: response => {
          if (Cypress.env('RECORD')) {
             const url = response.url; // eslint-disable-line
             const method = response.method; // eslint-disable-line
             const data = response?.response?.body; // eslint-disable-line
             xhrData.push({ url, method, data });
           }
        }
      });

      // This tells Cypress to hook into any GET request
      if (Cypress.env('RECORD')) {
        cy.route({
          method: 'GET',
          url: '*',
        });
      }

      if (!Cypress.env('RECORD')) {
         cy.fixture(asSlug(title)).then((data) => {
           for (let i = 0, length = data.length; i < length; i++) { // eslint-disable-line
             cy.route(data[i].method, data[i].url, data[i].data); // eslint-disable-line
           }
         });
       }

    });
    testConfig.forEach((testGroup) => {
      describe(testGroup.title, () => {
        const {spec} = testGroup;
        testGroup.tests.forEach((test) => {
          if (test.only) {
            it.only(test.description, () => {
              spec.test(test);
            });
          } else {
            it(test.description, () => {
              spec.test(test);
            });
          }
        });
      });
    });
  });
}

export default (title, tests) => initSpec(title, tests);
