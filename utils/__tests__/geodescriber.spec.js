import {
  dynamicGeodescriberSentence,
  isGeodescriberLocation,
} from '../geodescriber';

jest.mock('../lang', () => ({
  translateText: (str) => `t:${str}`,
}));

describe('utils/geodescriber', () => {
  describe('isGeodescriberLocation', () => {
    it('returns false for global and country types', () => {
      expect(isGeodescriberLocation({ type: 'global' })).toBe(false);
      expect(isGeodescriberLocation({ type: 'country' })).toBe(false);
    });

    it('returns true for other location types', () => {
      expect(isGeodescriberLocation({ type: 'aoi' })).toBe(true);
    });
  });

  describe('dynamicGeodescriberSentence', () => {
    it('translates non-area params and formats area params', () => {
      const sentence = 'Example sentence';
      const params = {
        area_0: '123ha',
        label: 'Forest',
      };

      const result = dynamicGeodescriberSentence(sentence, params);

      expect(result.sentence).toBe(sentence);
      expect(result.params.label).toBe('Forest');
      expect(result.params.area_0).toBe('123 ha');
    });
  });
});
