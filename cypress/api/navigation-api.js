const ENVIRONMENT = Cypress.env.NEXT_PUBLIC_FEATURE_ENV;

// const STAGING_URL = 'https://staging.globalforestwatch.org/'
const STAGING_URL = 'localhost:3000/';
// const PRODUCTION_URL = 'https://globalforestwatch.org/'

const HOMEPAGE = ENVIRONMENT === 'staging' ? STAGING_URL : STAGING_URL;

const goToDashboardFromHome = () => {
  cy.visit(HOMEPAGE);
  cy.get('a.nav-link').contains('Dashboard').click();
};

const selectCountryOnDashboard = (countryName) => {
  cy.get('button.arrow-btn').click();
  cy.get('input#dropdown-input').type(countryName);
  cy.get('#dropdown-item-0').click();
};

export { goToDashboardFromHome, selectCountryOnDashboard };
