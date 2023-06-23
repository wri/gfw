import initSpecFile from '../utils/init-spec-file';

const testConfig = [
  {
    title: 'Validates otf service displays widgets correctly',
    tests: [
      {
        slug: 'default',
        description: 'Gana shape Testing OTF tree cover gain',
        visit:
          '/map/geostore/6d5cfdf69bf468fc9b22c420e3c52d20/?analysis=eyJzaG93RHJhdyI6dHJ1ZX0%3D&mainMap=eyJzaG93QW5hbHlzaXMiOnRydWV9&map=eyJjZW50ZXIiOnsibGF0Ijo2LjQ4MDk3MTM4MTE4ODg4MiwibG5nIjotMS4xMzY1ODQ5ODg5ODI0OTU3fSwiem9vbSI6Ny45NTc5NzcyNjkxODQzMSwiZGF0YXNldHMiOlt7ImRhdGFzZXQiOiJ0cmVlLWNvdmVyLWdhaW4iLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsidHJlZS1jb3Zlci1nYWluLTIwMDEtMjAyMCJdfSx7ImRhdGFzZXQiOiJwb2xpdGljYWwtYm91bmRhcmllcyIsImxheWVycyI6WyJkaXNwdXRlZC1wb2xpdGljYWwtYm91bmRhcmllcyIsInBvbGl0aWNhbC1ib3VuZGFyaWVzIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XX0%3D&mapMenu=eyJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIiwiZGF0YXNldENhdGVnb3J5IjoiZm9yZXN0Q2hhbmdlIn0%3D&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6InN1YnNjcmliZVRvQXJlYSIsInN0ZXBzSW5kZXgiOjB9',
        test: 'sentence-treeCoverGainSimple',
        sentence:
          'From {yearStart} to {yearEnd}, Area near Ashanti Region, Ghana gained {valueGain} of tree cover equal to {valueExtent} is its total extent.',
      },
      {
        slug: 'default',
        description: 'Rio Branco shape Testing OTF tree cover loss',
        visit:
          '/map/geostore/211fca3fbea311473797cc967bc7a073/?analysis=eyJzaG93RHJhdyI6dHJ1ZX0%3D&mainMap=eyJzaG93QW5hbHlzaXMiOnRydWV9&map=eyJjZW50ZXIiOnsibGF0IjotOS43OTk1NDczMDQwNjM5ODMsImxuZyI6LTY3LjgzNjM2NDI5MDkzNDExfSwiem9vbSI6MTEuOTY2ODg2Njk1ODc3MDA2LCJjYW5Cb3VuZCI6ZmFsc2UsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoicG9saXRpY2FsLWJvdW5kYXJpZXMiLCJsYXllcnMiOlsiZGlzcHV0ZWQtcG9saXRpY2FsLWJvdW5kYXJpZXMiLCJwb2xpdGljYWwtYm91bmRhcmllcyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiJ0cmVlLWNvdmVyLWxvc3MiLCJsYXllcnMiOlsidHJlZS1jb3Zlci1sb3NzIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XX0%3D',
        test: 'sentence-treeLoss',
        sentence:
          'From {startYear} to {endYear}, Area in Acre, Brazil lost {loss} of tree cover, equivalent to a {percent} decrease in tree cover since {extentYear}.',
      },
      {
        slug: 'default',
        description: 'Rio Branco shape Testing OTF tree cover extent 2000',
        visit:
          '/map/geostore/211fca3fbea311473797cc967bc7a073/?analysis=eyJzaG93RHJhdyI6dHJ1ZX0%3D&mainMap=eyJzaG93QW5hbHlzaXMiOnRydWV9&map=eyJjZW50ZXIiOnsibGF0IjotOS43ODk4NTQ0NDk2NjI0OTIsImxuZyI6LTY3LjgxNDg0NzUzNTk4MzE2fSwiem9vbSI6MTMuMzc2NDA3MTg0NjQ0NzYsImNhbkJvdW5kIjpmYWxzZSwiZGF0YXNldHMiOlt7ImRhdGFzZXQiOiJ0cmVlLWNvdmVyIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbInRyZWUtY292ZXItMjAwMCJdfSx7ImRhdGFzZXQiOiJwb2xpdGljYWwtYm91bmRhcmllcyIsImxheWVycyI6WyJkaXNwdXRlZC1wb2xpdGljYWwtYm91bmRhcmllcyIsInBvbGl0aWNhbC1ib3VuZGFyaWVzIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XX0%3D&mapMenu=eyJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIiwiZGF0YXNldENhdGVnb3J5IjoibGFuZENvdmVyIn0%3D',
        test: 'sentence-treeCover2000',
        sentence:
          'As of {year}, {percentage} of Area in Acre, Brazil land cover was {threshold} tree cover.',
      },
      // {
      //   slug: 'default',
      //   description: 'Rio Branco shape Testing OTF glad',
      //   visit:
      //     '/map/geostore/211fca3fbea311473797cc967bc7a073/?analysis=eyJzaG93RHJhdyI6dHJ1ZX0%3D&mainMap=eyJzaG93QW5hbHlzaXMiOnRydWV9&map=eyJjZW50ZXIiOnsibGF0IjotOS43ODk4NTQ0NDk2NjE2NjYsImxuZyI6LTY3LjgxNDg0NzUzNTk3NzM0fSwiem9vbSI6MTMuMzM2NDc1NzEyMzY5Nzc2LCJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImdsYWQtZGVmb3Jlc3RhdGlvbi1hbGVydHMiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiZGVmb3Jlc3RhdGlvbi1hbGVydHMtZ2xhZCJdLCJ0aW1lbGluZVBhcmFtcyI6eyJzdGFydERhdGUiOiIyMDE1LTAxLTAxIiwiZW5kRGF0ZSI6IjIwMTUtMTItMzEiLCJ0cmltRW5kRGF0ZSI6IjIwMTUtMTItMzEifX0seyJkYXRhc2V0IjoicG9saXRpY2FsLWJvdW5kYXJpZXMiLCJsYXllcnMiOlsiZGlzcHV0ZWQtcG9saXRpY2FsLWJvdW5kYXJpZXMiLCJwb2xpdGljYWwtYm91bmRhcmllcyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV19&mapMenu=eyJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIiwiZGF0YXNldENhdGVnb3J5IjoiZm9yZXN0Q2hhbmdlIn0%3D',
      //   test: 'sentence-gladAlerts',
      //   sentence:
      //     'There were {count} GLAD alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.',
      // },
    ],
    spec: {
      test: (sheet) => {
        cy.visit(sheet.visit, {
          timeout: 120000,
          retryOnStatusCodeFailure: true,
          // https://github.com/cypress-io/cypress/issues/943#issuecomment-730705557
          headers: { 'Accept-Encoding': 'gzip, deflate' },
        });
        // Agree cookies
        cy.get('.cookies-button > button').click();
        // Close welcome modal
        cy.get('.modal-close').click();
        cy.wait(1000); // eslint-disable-line
        cy.isValidSentence(sheet.test, sheet.sentence);
      },
    },
  },
];

// Title, config, lock = if true, fixtures will be locked even in recording mode
initSpecFile('OTF spec', testConfig, true);
