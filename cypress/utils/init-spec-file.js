function initSpec(title, testConfig) {
  describe(title, () => {
    beforeEach(() => {
      cy.server();
      cy.route('/query/*').as('analysis-service');
    });
    testConfig.forEach((testGroup) => {
      describe(testGroup.title, () => {
        const {spec} = testGroup;
        testGroup.tests.forEach((test) => {
          if (spec.only) {
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
