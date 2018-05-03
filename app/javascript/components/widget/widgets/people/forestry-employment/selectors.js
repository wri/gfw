import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getColors = state => state.colors;
const getSentences = state => state.config.sentences;

// get lists selected
export const getFilteredData = createSelector(
  [getData, getLocationNames],
  (data, locationNames) => {
    if (isEmpty(data)) return null;

    return data
      .filter(
        item =>
          item.country === locationNames.current.value && item.year !== 9999
      )
      .map(item => ({
        male: item.femempl
          ? (item.forempl - item.femempl) * 1000
          : item.forempl,
        female: item.femempl ? item.femempl * 1000 : null,
        year: item.year
      }));
  }
);

export const parseData = createSelector(
  [getFilteredData, getSettings, getColors],
  (data, settings, colors) => {
    if (isEmpty(data)) return null;

    const { year } = settings;
    const selectedFAO = data.filter(item => item.year === year);
    const { male, female } = selectedFAO[0];
    if (!female) return null;

    const total = male + female;
    const formatedData = [
      {
        label: 'Male',
        value: male,
        color: colors.male,
        percentage: male / total * 100
      },
      {
        label: 'Female',
        value: female,
        color: colors.female,
        percentage: female / total * 100
      }
    ];
    return formatedData;
  }
);

export const getSentence = createSelector(
  [getFilteredData, getSettings, getLocationNames, getSentences],
  (data, settings, locationNames, sentences) => {
    if (!data) return null;
    const { year } = settings;
    const { initial, withFemales } = sentences;
    const selectedFAO = data.find(item => item.year === year);
    let employees = 0;
    let females = 0;
    if (selectedFAO) {
      employees = selectedFAO.female
        ? selectedFAO.male + selectedFAO.female
        : selectedFAO.male;
      females = parseInt(selectedFAO.female, 10);
    }

    const params = {
      location: `${locationNames &&
        locationNames.current &&
        locationNames.current.label}'s`,
      value: `${employees ? format('.3s')(employees) : 'no'}`,
      percent: `${format('.2s')(100 * females / employees)}%`,
      year
    };

    return {
      sentence: females ? withFemales : initial,
      params
    };
  }
);
