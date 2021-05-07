import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getColors = (state) => state.colors;
const getLocationName = (state) => state.locationLabel;
const getSentences = (state) => state.sentences;

export const parseConfig = createSelector(
  [getData, getColors, getSettings],
  (data, colors) => {
    const {
      carbonFlux: { emissions, netCarbonFlux, removals },
    } = colors;
    if (!data) return null;

    const { flux: fluxValue } = data[0];
    const maxValue =
      Math.abs(
        Object.values(data[0]).reduce((a, b) => (data[a] > data[b] ? b : a))
      ) * 1.5;

    return {
      height: 250,
      stackOffset: 'sign',
      margin: {
        bottom: 40,
      },
      yAxis: {
        hide: true,
        type: 'category',
      },
      xAxis: {
        type: 'number',
        domain: [-maxValue, maxValue],
        allowDecimals: false,
        ticks: [-maxValue, -maxValue / 2, 0, maxValue / 2, maxValue],
        tickFormatter: (value) => format('.1s')(value),
        label: {
          value: 'GtCO2/year',
          fontSize: '14px',
          position: 'bottom',
        },
      },
      xKeys: {
        bars: {
          emissions: {
            fill: emissions,
            background: false,
            stackId: 2,
            labelList: {
              // value: 'EMISSIONS',
              content: (props) => {
                const { x, y, width, height, value } = props;
                const yPosition = Math.ceil(height / 2 + (height / 2.5))
                const xPosition = x + (width + (width / 4))
                console.log(props, 'content')

                return (
                  <g transform={`translate( 45)`}>
                   <text x={x + width} y={y} textAnchor="middle" fill="#000">
                     EMISSIONS
                   </text>
                  </g>
                )
              },
            },
          },
          removals: {
            fill: removals,
            background: false,
            stackId: 2,
            labelList: {
              content: (props) => {
                // XXX: Work from here
                const { x, y, offset, width, height, value } = props;
                console.log('removals', props);
                return (
                  <g transform={`translate(0 ${(height / 2) + offset})`}>
                   <text x={(x + width) - offset} y={y} textAnchor="end" fill="#000">
                     REMOVALS
                   </text>
                  </g>
                )
              },
            },
          },
          flux: {
            fill: netCarbonFlux,
            background: false,
            labelList: {
              content: (props) => {
                const { x, y, width, height, value } = props;
                const xPosition = x + (width + (width / 4))
                return (
                  <g transform="translate(-36 45)">
                   <text x={xPosition} y={y} textAnchor="middle" fill="#000">
                   NET CARBON FLUX
                   </text>
                  </g>
                )
              },
            },
          },
        },
      },
      referenceLine: { x: 0, stroke: '#606060', strokeWidth: 2 },
      tooltip: [
        {
          label: 'Carbon flux (tCO2/year)',
        },
        {
          key: 'emissions',
          label: 'Emissions',
          unitFormat: (value) => format('.3s')(value),
          color: emissions,
        },
        {
          key: 'removals',
          label: 'Removals',
          unitFormat: (value) => format('.3s')(value),
          color: removals,
        },
        {
          key: 'flux',
          label: 'Net',
          unitFormat: (value) => format('.3s')(value),
          color: netCarbonFlux,
        },
      ],
    };
  }
);

export const parseSentence = createSelector(
  [getData, getSentences, getLocationName],
  (data, sentences, locationName) => {
    if (!data || isEmpty(data)) return null;

    const { initial } = sentences;
    // if multiple sentences - implement logic

    const startYear = 2001;
    const endYear = 2020;
    const { emissions, removals, flux } = data[0];

    const params = {
      startYear,
      endYear,
      location: locationName,
      totalEmissions: formatNumber({
        num: emissions / (endYear - startYear),
        unit: 'tCO2',
      }),
      totalRemovals: formatNumber({
        num: removals / (endYear - startYear),
        unit: 'tCO2',
      }),
      totalFlux: formatNumber({
        num: flux / (endYear - startYear),
        unit: 'tCO2',
      }),
    };
    return { sentence: initial, params };
  }
);

export default createStructuredSelector({
  data: getData,
  config: parseConfig,
  sentence: parseSentence,
});
