import { Sentence } from '../utils/template-tags';

function validSentence(selector, sentence) {
  cy.get(selector).invoke('text').then((text => {
    expect(sentence.test(text.trim())).to.be.true; // eslint-disable-line
  }));
}

const widgets = [
  {
    type: 'header widget',
    mock: {
      sentence: Sentence`In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.`
    },
    specs: [
      {
        title: 'Validates header widget returns correct sentence',
        description: 'when Indonesia is selected',
        url: '/dashboards/country/IDN',
        test: mock => {
          cy.visit('/dashboards/country/IDN');
          validSentence('.c-dashboards-header .c-dynamic-sentence', mock.sentence);
        }
      },
      {
        title: 'Validates header widget returns correct sentence',
        description: 'when Indonesia is selected where adm1 is 1',
        url: '/dashboards/country/IDN/1',
        test: mock => {
          cy.visit('/dashboards/country/IDN');
          validSentence('.c-dashboards-header .c-dynamic-sentence', mock.sentence);
        }
      },
      {
        title: 'Validates header widget returns correct sentence',
        description: 'when Indonesia is selected where adm1 is 1 and adm2 is 1',
        url: '/dashboards/country/IDN/1/1',
        test: mock => {
          cy.visit('/dashboards/country/IDN');
          validSentence('.c-dashboards-header .c-dynamic-sentence', mock.sentence);
        }
      }
    ]
  }
]

describe('Widgets spec', () => {
  widgets.forEach(widget => {
    describe(widget.type, () => {
      widget.specs.forEach(spec => {
        it(`${spec.title} ${spec.description}`, () => {
          spec.test(widget.mock);
        });
      });
    });
  });
});
