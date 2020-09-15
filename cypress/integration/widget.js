import initSpecFile from '../utils/init-spec-file';

const tests = [
  {
    title: 'Validates header widget returns correct sentence',
    mock: {
      selector: '.c-dashboards-header .c-dynamic-sentence',
      sentence: 'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.'
    },
    specs: [
      {
        description: 'when Indonesia is selected',
        only: true,
        test: mock => {
          cy.visit('/dashboards/country/IDN');
          cy.isValidSentence(mock.selector, mock.sentence);
        }
      },
      {
        description: 'when Indonesia is selected where adm1 is 1',
        test: mock => {
          cy.visit('/dashboards/country/IDN/1');
          cy.isValidSentence(mock.selector, mock.sentence);
        }
      },
      {
        description: 'when Indonesia is selected where adm1 is 1 and adm2 is 1',
        test: mock => {
          cy.visit('/dashboards/country/IDN/1/1');
          cy.isValidSentence(mock.selector, mock.sentence);
        }
      }
    ]
  }
]

initSpecFile('Widgets spec', tests);
