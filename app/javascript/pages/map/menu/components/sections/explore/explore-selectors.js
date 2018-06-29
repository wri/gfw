import { createSelector } from 'reselect';

export const getData = createSelector([], () => [
  {
    id: 0,
    title: 'Climate',
    summary:
      'Forests remove carbon from the atmosphere, their loss or degradation compromises their ability to remove our ever-increasing emissions.',
    image: 'https://www.globalforestwatch.org/assets/covers/stories-cover.png'
  },
  {
    id: 1,
    title: 'Climate',
    summary:
      'Forests remove carbon from the atmosphere, their loss or degradation compromises their ability to remove our ever-increasing emissions.',
    image: 'https://www.globalforestwatch.org/assets/covers/stories-cover.png'
  },
  {
    id: 2,
    title: 'Climate',
    summary:
      'Forests remove carbon from the atmosphere, their loss or degradation compromises their ability to remove our ever-increasing emissions.',
    image: 'https://www.globalforestwatch.org/assets/covers/stories-cover.png'
  }
]);
