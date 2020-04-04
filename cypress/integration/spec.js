describe('Homepage', () => {
  it('it works', () => {
    cy.visit('/');
    cy.contains('h1', 'Forest Monitoring Designed for Action');
  });
});

context('Main page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should verify the score of the main page', () => {
    cy.audit();
  });
});
