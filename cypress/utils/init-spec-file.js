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
    // 75.6mb
    // 4.8mb

    beforeEach(() => {
      cy.server({
        onResponse: response => {
          // If we are in "record mode", push requests we are spying on into memory
          // these will later be stored as a fixture
          if (Cypress.env('RECORD')) {
             const url = response.url; // eslint-disable-line
             const method = response.method; // eslint-disable-line
             const data = response?.response?.body; // eslint-disable-line
             if (!xhrData.find(x => x.url === url)) {
               xhrData.push({ url, method, data });
             }
           }
        }
      });

      // This tells Cypress to hook into any GET request we specify bellow
      // Its IMPORTANT not to spy on all requests, you will end up with a HUGE file that will crash the world
      // Ex; recording all requests fileSize 100mb+
      // Ex; specifying spyOn requests fileSize: 4mb ish
      if (Cypress.env('RECORD')) {
        cy.route({
          method: 'GET',
          url: '/query/*',
        });
        cy.route({
          method: 'GET',
          url: '/api/v2/*',
        });
        cy.route({
          method: 'GET',
          url: '/v1/dataset/*',
        });
        cy.route({
          method: 'GET',
          url: '/v2/geostore/*',
        });
      }

      // When we are not recording, read our generated fixture for specified requests
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
