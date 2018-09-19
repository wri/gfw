import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getActiveDatasetsState, getActiveLayers } from '../../selectors';

const getSelected = state => state.popup.selected;
const getSearch = state => state.location && state.location.search;
const getInteractions = state => state.popup.interactions;
const getLatLng = state => state.popup.latlng;

export const filterInteractions = createSelector(
  [getInteractions],
  interactions => {
    if (isEmpty(interactions)) return null;
    return Object.values(interactions)
      .filter(i => !isEmpty(i.data))
      .map(i => ({
        ...i
      }));
  }
);

export const getSelectedInteraction = createSelector(
  [filterInteractions, getSelected, getActiveLayers],
  (options, selected, layers) => {
    if (isEmpty(options)) return null;
    let selectedData = options.find(o => o.article);
    if (!selectedData && options.length === 1) selectedData = options[0];
    if (!selectedData) selectedData = options.find(o => o.value === selected);
    const layer = layers.find(l => l.id === selectedData.id);

    return { ...selectedData, layer };
  }
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
      buttons: [
        {
          text: 'READ MORE',
          extLink: readMoreLink,
          theme: 'theme-button-light theme-button-small'
        },
        {
          text: 'ANALYZE',
          theme: 'theme-button-small'
        }
      ]
    };
  }
);

export const getTableData = createSelector(
  [getSelectedInteraction],
  interaction => {
    if (isEmpty(interaction) || interaction.article) return null;
    const { config, data } = interaction;

    return config.filter(c => !c.hidden).map(c => ({
      label: c.property,
      value: data[c.column]
    }));
  }
);

export const getPopupProps = createStructuredSelector({
  interactions: filterInteractions,
  selected: getSelectedInteraction,
  tableData: getTableData,
  cardData: getCardData,
  latlng: getLatLng,
  activeDatasets: getActiveDatasetsState,
  search: getSearch
});
