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
    const layersWithoutBoundaries = layers.filter(
      l => !l.isBoundary && !isEmpty(l.interactionConfig)
    );
    // if there is an article (icon layer) then choose that
    let selectedData = options.find(o => o.article);
    // if there is nothing selected get the top layer
    if (!selected && layers) {
      selectedData = options.find(
        o => o.value === layersWithoutBoundaries[0].id
      );
    }
    // if only one layer then get that
    if (!selectedData && options.length === 1) selectedData = options[0];
    // otherwise get based on selected
    if (!selectedData) selectedData = options.find(o => o.value === selected);
    const layer =
      selectedData && layers && layers.find(l => l.id === selectedData.id);

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

    return (
      config &&
      config.filter(c => !c.hidden).map(c => ({
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
  search: getSearch
});
