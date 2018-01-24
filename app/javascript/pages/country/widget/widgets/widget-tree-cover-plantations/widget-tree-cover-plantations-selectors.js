import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getIndicatorWhitelist = state => state.whitelist;
const getColors = state => state.colors;

// get lists selected
export const getTreeCoverPlantationsData = createSelector(
  [getData, getSettings, getIndicatorWhitelist, getColors],
  (data, settings, whitelist, colors) => {
    if (isEmpty(data) || isEmpty(whitelist)) return null;
    const { plantations } = data;
    const totalPlantations = sumBy(plantations, 'plantation_extent');

    return sortByKey(
      plantations.map(d => ({
        label: d.label,
        value: d.plantation_extent,
        color: colors[d.label],
        percentage: d.plantation_extent / totalPlantations * 100
      })),
      'value',
      true
    );
  }
);

export const getSentence = createSelector(
  [getTreeCoverPlantationsData, getSettings, getLocationNames],
  (data, settings, locationNames) => {
    if (isEmpty(data)) return null;
    const locationLabel = locationNames.current && locationNames.current.label;
    let topTypesSentence = '';
    let top = null;
    let remainSentence = '';
    if (settings.type === 'bound2') {
      top = data.slice(0, 2);
      topTypesSentence = `<b>${top[0].label}</b> and <b>${
        top[1].label
      }</b> represents the largest plantations by <b>species</b>`;
      remainSentence = `The remaining <b>${format('.2s')(
        sumBy(data.slice(2), 'value')
      )}ha</b> of tree cover is distributed between <b>${data.length -
        top.length}</b> other plantation species.`;
    } else {
      top = data.slice(0, 1);
      topTypesSentence = `the largest plantation type by area is <b>${
        top[0].label
      }</b>`;
    }

    return `In <b>${locationLabel}</b>, ${topTypesSentence} in <b>${
      settings.extentYear
    }</b>, spanning <b>${format('.2s')(
      sumBy(top, 'value')
    )}ha</b> where the canopy cover is greater than <b>${
      settings.threshold
    }%</b>. ${remainSentence}`;
  }
);
