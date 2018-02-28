import { createElement } from 'react';

import Earth from './img/earth.svg';
import Map from './img/map.svg';
import People from './img/people.svg';

import Component from './section-about-component';

const benefits = [
  'Grant awards between $10K - $40K.',
  'Individualized training and support.',
  'Form part of the GFW partnership.'
];

const results = [
  {
    icon: Earth,
    label: '<b>44 projects</b> from <b>30 countries</b>'
  },
  {
    icon: Map,
    label: 'Over <b>1.8 billion hectares</b> of forests monitored using GFW'
  },
  {
    icon: People,
    label: 'Over <b>1,800</b> people trained in using GFW'
  }
];

export default () => createElement(Component, { benefits, results });
