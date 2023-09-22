const goToDashboardFromHome = () => {
  cy.visit('/');
  cy.get('a.nav-link').contains('Dashboard').click();
};

const selectCountryOnDashboard = (countryName) => {
  cy.get('button.arrow-btn').click();
  cy.get('input#dropdown-input').type(countryName);
  cy.get('#dropdown-item-0').click();
};

export { goToDashboardFromHome, selectCountryOnDashboard };
