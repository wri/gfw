import initSpecFile from '../utils/init-spec-file';

const tests = [
  {
    title: 'Validates header widget returns correct sentence',
    mock: {
      headerSentenceSelectorCountry: '.c-dashboards-header .c-dynamic-sentence',
      headerSentenceSelectorAdmin: '.c-dashboards-header .c-dynamic-sentence',
      sentenceDefault:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
      sentenceIDN:
        'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
    },
    specs: [
      {
        description: 'when a country with no forest is selected (ATA)',
        test: (mock) => {
          cy.visit('/dashboards/country/ATA');
          cy.isValidSentence(
            mock.headerSentenceSelectorCountry,
            mock.sentenceDefault
          );
        },
      },
      {
        description: 'when Indonesia is selected',
        test: (mock) => {
          cy.visit('/dashboards/country/IDN');
          cy.isValidSentence(
            mock.headerSentenceSelectorCountry,
            mock.sentenceIDN
          );
        },
      },
      {
        description: 'when Indonesia is selected where adm1 is 1',
        test: (mock) => {
          cy.visit('/dashboards/country/IDN/1');
          cy.isValidSentence(
            mock.headerSentenceSelectorAdmin,
            mock.sentenceIDN
          );
        },
      },
      {
        description: 'when Indonesia is selected where adm1 is 1 and adm2 is 1',
        test: (mock) => {
          cy.visit('/dashboards/country/IDN/1/1');
          cy.isValidSentence(
            mock.headerSentenceSelectorAdmin,
            mock.sentenceIDN
          );
        },
      },
    ],
  },
];

initSpecFile('Widgets spec', tests);
