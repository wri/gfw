import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getRanking = state => state.ranking || null;
const getGain = state => state.gain || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getIndicator = state => state.indicator || null;
const getLocationNames = state => state.locationNames || null;

export const getSortedData = createSelector(
  [getRanking, getSettings, getLocation, getLocationsMeta],
  (ranking, settings, location, meta) => {
    if (!ranking || isEmpty(ranking) || !meta || isEmpty(meta)) return [];
    const dataMapped = [];
    ranking.forEach(d => {
      const region = meta.find(l => d.id === l.value);
      let path = '/country/';
      if (location.subRegion) {
        path += `${location.country}/${location.region}/${d.id}`;
      } else if (location.region) {
        path += `${location.country}/${d.id}`;
      } else {
        path += d.id;
      }

      if (region) {
        dataMapped.push({
          label: (region && region.label) || '',
          value: settings.unit === 'ha' ? d.gain : d.relative,
          path
        });
      }
    });
    return sortByKey(uniqBy(dataMapped, 'label'), 'value', true);
  }
);

export const getSentence = createSelector(
  [getGain, getExtent, getSettings, getIndicator, getLocationNames],
  (gain, extent, settings, indicator, locationNames) => {
    if (!gain || !extent || !settings || !indicator || !locationNames) { return ''; }
    const regionPhrase =
      indicator.indicator === 'gadm28'
        ? '<span>region-wide</span>'
        : `in <span>${indicator && indicator.label.toLowerCase()}</span>`;

    const areaPercent = format('.1f')(100 * gain / extent);
    const firstSentence = `From 2001 to 2012, <span>${locationNames.current &&
      locationNames.current.label}</span> gained <strong>${
      gain ? format('.3s')(gain) : '0'
    }ha</strong> of tree cover ${regionPhrase}`;
    const secondSentence = gain
      ? `, equivalent to a <strong>${areaPercent}%</strong> increase relative to <b>${
        settings.extentYear
      }</b> tree cover extent.`
      : '.';

    return `${firstSentence}${secondSentence}`;
  }
);
