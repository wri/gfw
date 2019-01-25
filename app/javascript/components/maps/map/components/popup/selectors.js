import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { reverseLatLng } from 'utils/geoms';

import {
  getActiveDatasetsFromState,
  filterInteractions,
  getSelectedInteraction
} from 'components/maps/map/selectors';

const getSearch = state => state.location && state.location.search;
const getLatLng = state => state.popup && state.popup.latlng;

export const getIsBoundary = createSelector(
  getSelectedInteraction,
  interaction => interaction && interaction.isBoundary
);

export const getCardData = createSelector(
  [getSelectedInteraction],
  interaction => {
    if (isEmpty(interaction) || !interaction.article) return null;
    const { data, config } = interaction;
    const articleData = config.reduce((obj, param) => {
      const { prefix, renderKey } = param;
      const value = data[param.column || param.key];
      const newObj = {
        ...obj,
        ...(renderKey &&
          value && {
            [renderKey]: `${prefix || ''}${value}`
          })
      };
      return newObj;
    }, {});
    const { readMoreLink } = articleData || {};

    const readMoreBtn = {
      text: 'READ MORE',
      extLink: readMoreLink,
      theme: `theme-button-small ${data.bbox ? 'theme-button-light' : ''}`
    };

    const buttons = data.bbox
      ? [readMoreBtn].concat([
        {
          text: 'ZOOM',
          theme: 'theme-button-small'
        }
      ])
      : [readMoreBtn];

    return {
      ...articleData,
      ...(data.bbox && {
        bbox: reverseLatLng(JSON.parse(data.bbox).coordinates[0])
      }),
      buttons
    };
  }
);

export const getTableData = createSelector(
  [getSelectedInteraction, getIsBoundary],
  (interaction, isBoundary) => {
    console.log(interaction);
    if (isEmpty(interaction) || interaction.article) return null;
    const { config, data } = interaction;
    if (isBoundary) {
      return config.reduce(
        (obj, c) => ({
          ...obj,
          [c.column]: data[c.column]
        }),
        {}
      );
    }

    return Object.keys(interaction).map(i => ({
      label: i,
      value: interaction[i]
    }));
  }
);

export const getPopupProps = createStructuredSelector({
  interactions: filterInteractions,
  selected: getSelectedInteraction,
  tableData: getTableData,
  cardData: getCardData,
  latlng: getLatLng,
  activeDatasets: getActiveDatasetsFromState,
  search: getSearch,
  isBoundary: getIsBoundary
});
