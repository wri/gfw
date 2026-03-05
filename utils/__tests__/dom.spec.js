import { isParent } from '../dom';

jest.mock('react-dom', () => ({
  findDOMNode: () => ({
    contains: (target) => target === 'child',
  }),
}));

describe('utils/dom', () => {
  it('returns false when target is contained within the parent node', () => {
    expect(isParent({}, 'child')).toBe(false);
  });

  it('returns true when target is not contained within the parent node', () => {
    expect(isParent({}, 'other')).toBe(true);
  });
});
