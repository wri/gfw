import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getColors = state => state.colors;

// get lists selected
export const getFilteredData = createSelector(
  [getData, getLocationNames],
  (data, locationNames) => {
    if (!data || !data.fao) return null;

    return data.fao
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

export const charData = createSelector(
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
  [getFilteredData, getSettings, getLocationNames],
  (data, settings, locationNames) => {
    if (!data) return '';

    const { year } = settings;
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const selectedFAO = data.filter(item => item.year === year);
    const employees = selectedFAO[0].female
      ? selectedFAO[0].male + selectedFAO[0].female
      : selectedFAO[0].male;
    return `According to the FAO there were <b>${
      employees ? format('.3s')(employees) : 'no'
    }</b> people employed in <b>${
      currentLocation
    }'s</b> Forestry sector in <b>${year}</b>${
      parseInt(selectedFAO[0].female, 10)
        ? `, of which <b>${format('.3s')(
          selectedFAO[0].female
        )}</b> were female`
        : ''
    }.`;
  }
);
