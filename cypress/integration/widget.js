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
        description:
          'when Indonesia is selected correct sentence template returned',
        visit: '/dashboards/country/IDN',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
      },
      {
        slug: 'indonesiaAdm1',
        description:
          'when and admin 1 in Indonesia is selected correct sentence template returned',
        visit: '/dashboards/country/IDN/1',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
      },
      {
        slug: 'indonesiaAdm2',
        description:
          'when an admin 2 in Indonesia is selected correct sentence template returned',
        visit: '/dashboards/country/IDN/1/1',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
      },
      {
        slug: 'plantationsIso',
        description:
          'when country with plantations is selected correct sentence template returned',
        visit: '/dashboards/country/ESP',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest.',
      },
      {
        slug: 'plantationsAdm1',
        description:
          'when admin 1 with plantations is selected correct sentence template returned',
        visit: '/dashboards/country/ESP/12',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest.',
      },
      {
        slug: 'plantationsAdm2',
        description:
          'when admin 2 with plantations is selected correct sentence template returned',
        visit: '/dashboards/country/ESP/12/1',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest.',
      },
      {
        slug: 'plantationsTropicalIso',
        description:
          'when a tropical country with plantations is selected correct sentence template returned',
        visit: '/dashboards/country/MYS',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest, equivalent to {emissions} of CO\u2082 of emissions.',
      },
      {
        slug: 'plantationsTropicalAdm1',
        description:
          'when a tropical admin 1 with plantations is selected correct sentence template returned',
        visit: '/dashboards/country/MYS/14',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest, equivalent to {emissions} of CO\u2082 of emissions.',
      },
      {
        slug: 'plantationsTropicalAdm2',
        description:
          'when a tropical admin 2 with plantations is selected correct sentence template returned',
        visit: '/dashboards/country/MYS/14/31',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest, equivalent to {emissions} of CO\u2082 of emissions.',
      },
      {
        slug: 'lossIso',
        description:
          'when country with tree cover loss is selected correct sentence template returned',
        visit: '/dashboards/country/GUY',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover',
      },
      {
        slug: 'lossAdm1',
        description:
          'when admin 1 with tree cover loss is selected correct sentence template returned',
        visit: '/dashboards/country/GUY/2',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover',
      },
      {
        slug: 'lossAdm2',
        description:
          'when admin 2 with tree cover loss is selected correct sentence template returned',
        visit: '/dashboards/country/GUY/12/8',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover',
      },
      {
        slug: 'globalInitial',
        description:
          'when global tree cover loss is selected correct sentence template returned',
        visit: '/dashboards/global',
        selector: '.c-dashboards-header .c-dynamic-sentence',
        sentence:
          'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover.',
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
