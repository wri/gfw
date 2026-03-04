import { objDiff } from '../data';

describe('utils/data', () => {
  it('returns only differing keys between two objects', () => {
    const a = { foo: 1, bar: 2, baz: 3 };
    const b = { foo: 1, bar: 9, baz: 3 };

    const diff = objDiff(a, b);

    expect(diff).toEqual({ bar: 2 });
  });
});
