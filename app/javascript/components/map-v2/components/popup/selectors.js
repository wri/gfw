import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { getLayers } from '../../selectors';

const getSelected = state => state.selected;
const getInteractions = state => state.interactions;
const getLatLng = state => state.latlng;

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
  [filterInteractions, getSelected],
  (options, selected) => {
    if (isEmpty(options)) return null;
    const article = options.find(o => o.article);
    if (article) return article;
    if (!selected || options.length === 1) return options[0];
    return options.find(o => o.value === selected);
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
        [param.renderKey]: data[param.column]
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
          extLink: '#',
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

    return config.map(c => ({
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
  layers: getLayers
});
