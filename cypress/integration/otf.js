import initSpecFile from '../utils/init-spec-file';

const testConfig = [
  {
    title: 'Validates otf service displays widgets correctly',
    tests: [
      {
        slug: 'default',
        description: 'Gana shape Testing OTF tree cover loss',
        visit:
          '/map/geostore/6d5cfdf69bf468fc9b22c420e3c52d20/?analysis=eyJzaG93RHJhdyI6dHJ1ZX0%3D&mainMap=eyJzaG93QW5hbHlzaXMiOnRydWV9&map=eyJjZW50ZXIiOnsibGF0Ijo2LjQ4MDk3MTM4MTE4ODg4MiwibG5nIjotMS4xMzY1ODQ5ODg5ODI0OTU3fSwiem9vbSI6Ny45NTc5NzcyNjkxODQzMSwiY2FuQm91bmQiOmZhbHNlLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6InRyZWUtY292ZXItZ2FpbiIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJ0cmVlLWNvdmVyLWdhaW4tMjAwMS0yMDEyIl19LHsiZGF0YXNldCI6InBvbGl0aWNhbC1ib3VuZGFyaWVzIiwibGF5ZXJzIjpbImRpc3B1dGVkLXBvbGl0aWNhbC1ib3VuZGFyaWVzIiwicG9saXRpY2FsLWJvdW5kYXJpZXMiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dfQ%3D%3D&mapMenu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiJmb3Jlc3RDaGFuZ2UifQ%3D%3D&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6InN1YnNjcmliZVRvQXJlYSIsInN0ZXBzSW5kZXgiOjB9',
        selector: '#treeCoverGainSimple .c-dynamic-sentence',
        sentence:
          'From {yearStart} to {yearEnd}, Area near Ashanti Region, Ghana gained {valueGain} of tree cover equal to {valueExtent} is its total extent.',
      },
    ],
    spec: {
      test: (test) => {
        cy.visit(test.visit, {
          timeout: 100000,
          retryOnStatusCodeFailure: true,
        });
        // Agree cookies
        cy.get('.cookies-btn').click();
        // Close welcome modal
        cy.get('.modal-close').click();
        cy.wait(1000); // eslint-disable-line
        cy.isValidSentence(test.selector, test.sentence);
      },
    },
  },
];

initSpecFile('OTF spec', testConfig);
