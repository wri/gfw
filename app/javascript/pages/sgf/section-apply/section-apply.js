import { createElement } from 'react';
import Component from './section-apply-component';

const card1 = {
  title: 'THE 2016 RECIPIENTS',
  link:
    'http://blog.globalforestwatch.org/gfw-community/announcing-the-2016-recipients-of-the-small-grants-fund.html'
};

const card2 = {
  title: 'VISIT THE STORY MAP OF 2015 PROJECTS',
  link:
    'https://gfw.maps.arcgis.com/apps/MapJournal/index.html?appid=4c3a290ba73e46139fcc40d387a8d17d'
};

const card3 = {
  title: 'VISIT THE STORY MAP OF 2014 PROJECTS',
  link:
    'https://gfw.maps.arcgis.com/apps/MapJournal/index.html?appid=0a56f3905f88466b93ed5696ef6fde81'
};

const cards = [card1, card2, card3];

export default () => createElement(Component, { cards });
