import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';

import { formatNumber } from 'utils/format';
import {
  yearTicksFormatter,
} from 'components/widgets/utils/data';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getColors = (state) => state.colors;
const getIndicator = (state) => state.indicator;
const getLocationName = (state) => state.locationLabel;
const getSentences = (state) => state.sentences;

export const parseData = createSelector(
  [getData],
  (data) => {
    if (isEmpty(data)) return null;
    return data
  }
);

export const parseConfig = createSelector(
  [parseData, getColors, getSettings],
  (data, colors, settings) => {
    const  { fluxCarbon } = colors;
    /// get data

    return {
      height: 250,
      layout: 'vertical',
      xKey: 'umd_tree_cover_loss__year',
      yKeys: {
        bars: {
          emissions: {
            fill: fluxCarbon.emissions,
            background: false,
            stackId: 1,
          },
          netCarbonFlux: {
            fill: fluxCarbon.netCarbonFlux,
            background: false,
          },
          removals: {
            fill: fluxCarbon.removals,
            background: false,
            stackId: 1,
          },
        },
      },
      referenceLine: [
        { x: 0, label: null, stroke: 'rgba(0,0,0,0.5)' }
      ],
      xAxis: {
        tickFormatter: yearTicksFormatter,
      },
      tooltip: [
        {
          key: 'umd_tree_cover_loss__year',
        },
        {
          key: 'emissions',
          label: emissionLabel,
          unit: 't CO2e',
          unitFormat: (value) => format('.3s')(value),
          color: colors.main,
        },
      ],
      unit: 't CO2e',
      unitFormat: (value) => format('.2s')(value),
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getSettings, getIndicator, getSentences, getLocationName],
  (data, settings, indicator, sentences, locationName) => {
    if (!data || isEmpty(data)) return null;
    console.log(data)

    const { initial } = sentences;
    // if multiple sentences - implement logic

    const params = {
      location: locationName,
      // return emissions, removals and flux (and other values)
    };
    return { initial, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
});
