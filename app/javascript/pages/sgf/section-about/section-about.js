import { createElement } from 'react';
import Component from './section-about-component';

const benefits = {
  title: 'BENEFITS',
  items: [
    { label: 'Grant awards between $10K - $40K.' },
    { label: 'Technical assistance in using GFW.' },
    { label: 'Form part of the GFW partnership.' }
  ]
};

const results = {
  title: 'RESULTS',
  items: [
    { label: '# of grantes' },
    { label: '# of countries' },
    { label: '# of hectares monitored' },
    { label: '# of people trained' }
  ]
};

const projectTypes = {
  title: 'PROJECT TYPES',
  items: [
    {
      label: 'Forest management, monitoring and law enforcement'
    },
    {
      label: 'Community empowerment'
    },
    {
      label: 'Advocacy/policy change',
      tooltip:
        'Use GFW data as evidence to advocate for increased protected status or community land rights'
    },
    {
      label: 'Journalism/storytelling',
      tooltip:
        'Use GFW data as evidence to advocate for increased protected status or community land rights'
    }
  ]
};

const cards = [benefits, results, projectTypes];

export default () => createElement(Component, { cards });
