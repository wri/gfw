import { createElement } from 'react';
import Component from './section-about-component';

const benefits = {
  title: 'BENEFITS',
  items: [
    { label: '· Grant awards between $10K - $40K.' },
    { label: '· Individualized training and support.' },
    { label: '· Form part of the GFW partnership.' }
  ]
};

const results = {
  title: 'RESULTS',
  items: [
    { label: '· 44 projects from 30 countries' },
    { label: '· Over 1.8 billion hectares of forests monitored using GFW' },
    { label: '· Over 1,800 people trained in using GFW' }
  ]
};

const projectTypes = {
  title: 'PROJECT TYPES',
  items: [
    {
      label: '· Forest management, monitoring and law enforcement'
    },
    {
      label: '· Community empowerment'
    },
    {
      label: '· Advocacy/policy change',
      tooltip:
        'Use GFW data as evidence to advocate for increased protected status or community land rights'
    },
    {
      label: '· Journalism/storytelling',
      tooltip:
        'Use GFW data as evidence to advocate for increased protected status or community land rights'
    }
  ]
};

const cards = [benefits, results, projectTypes];

export default () => createElement(Component, { cards });
