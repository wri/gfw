import * as sentences from 'services/sentences';

describe('sentences service', () => {
  it('exports a sentences API object', () => {
    expect(sentences).toBeDefined();
    expect(typeof sentences).toBe('object');
  });
});
