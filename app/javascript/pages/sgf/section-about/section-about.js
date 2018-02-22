import { createElement } from 'react';
import icon from 'assets/icons/info.svg';

import Component from './section-about-component';

const benefits = [
  'Grant awards between $10K - $40K.',
  'Individualized training and support.',
  'Form part of the GFW partnership.'
];

const results = [
  {
    icon,
    label: '<b>44 projects</b> from <b>30 countries</b>'
  },
  {
    icon,
    label: 'Over <b>1.8 billion hectares</b> of forests monitored using GFW'
  },
  {
    icon,
    label: 'Over <b>1,800</b> people trained in using GFW'
  }
];

export default () => createElement(Component, { benefits, results });
