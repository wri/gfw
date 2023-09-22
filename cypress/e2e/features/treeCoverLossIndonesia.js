import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
  goToDashboardFromHome,
  selectCountryOnDashboard,
} from '../../api/navigation-api';

When('I visit Dashboard', () => {
  goToDashboardFromHome();
});

When('I select Indonesia', () => {
  selectCountryOnDashboard('Indonesia');
});

Then('I should see an image of Indonesia Primary Forest Loss', () => {
  cy.get('[data-cy="indonesia-img"').should('exist');
});
