import initSpecFile from '../utils/init-spec-file';

// All tests for widget. Each element collects similar tests which share a single spec key.
const testConfig = [
  {
    title: 'Validates header widget returns correct sentence',
    tests: [
      {
        slug: 'default',
        description:
          'when a country with no forest is selected (ATA) default sentence returns',
        visit: '/dashboards/country/ATA',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
      },
      {
        slug: 'indonesiaIso',
        description: 'when Indonesia is selected correct sentence returned',
        visit: '/dashboards/country/IDN',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
      },
      {
        slug: 'indonesiaAdm1',
        description: 'when Indonesia is selected correct sentence returned',
        visit: '/dashboards/country/IDN/1',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
      },
      {
        slug: 'indonesiaAdm2',
        description: 'when Indonesia is selected correct sentence returned',
        visit: '/dashboards/country/IDN/1/1',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
      },
    ],
    spec: {
      test: (test) => {
        cy.visit(test.visit);
        cy.isValidSentence(test.selector, test.sentence);
      },
    },
  },
];

initSpecFile('Widgets spec', testConfig);
