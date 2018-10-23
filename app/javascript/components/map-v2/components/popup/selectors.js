import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { reverseLatLng } from 'utils/geoms';

import {
  getActiveDatasetsState,
  filterInteractions,
  getSelectedInteraction
} from 'components/map-v2/selectors';

const getSearch = state => state.location && state.location.search;
const getLatLng = state => state.popup.latlng;

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
      const newObj = {
        ...obj,
        ...(param.renderKey && {
          [param.renderKey]: data[param.column]
        })
      };
      return newObj;
    }, {});
    const { readMoreLink } = articleData || {};

    return {
      ...articleData,
      bbox: reverseLatLng(JSON.parse(data.bbox).coordinates[0]),
      buttons: [
        {
          text: 'READ MORE',
          extLink: readMoreLink,
          theme: 'theme-button-light theme-button-small'
        },
        {
          text: 'ZOOM',
          theme: 'theme-button-small'
        }
      ]
    };
  }
);

export const getTableData = createSelector(
  [getSelectedInteraction, getIsBoundary],
  (interaction, isBoundary) => {
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

    return (
      config &&
      config.filter(c => !c.hidden).map(c => ({
        ...c,
        label: c.property,
        value: data[c.column]
      }))
    );
  }
);

export const getPopupProps = createStructuredSelector({
  interactions: filterInteractions,
  selected: getSelectedInteraction,
  tableData: getTableData,
  cardData: getCardData,
  latlng: getLatLng,
  activeDatasets: getActiveDatasetsState,
  search: getSearch,
  isBoundary: getIsBoundary
});
