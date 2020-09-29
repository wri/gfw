function initSpec(title, tests) {
  describe(title, () => {
    beforeEach(() => {
      cy.server();
      cy.route("/query/*").as("analysis-service")
    });
    tests.forEach(test => {
      describe(test.title, () => {
        test.specs.forEach(spec => {
          if (spec.only) {
            it.only(spec.description, () => {
              spec.test(test.mock);
            });
          } else {
            it(spec.description, () => {
              spec.test(test.mock);
            });
          }
        });
      });
    });
  });
}

export default (title, tests) => initSpec(title, tests);
