import { arrayMoveMutable, arrayMoveImmutable } from '../array-move';

describe('utils/array-move', () => {
  it('moves elements immutably', () => {
    const arr = [0, 1, 2, 3];
    const result = arrayMoveImmutable(arr, 1, 3);

    expect(result).toEqual([0, 2, 3, 1]);
    expect(arr).toEqual([0, 1, 2, 3]);
  });

  it('moves elements mutably', () => {
    const arr = [0, 1, 2, 3];
    arrayMoveMutable(arr, 1, 3);

    expect(arr).toEqual([0, 2, 3, 1]);
  });
});
