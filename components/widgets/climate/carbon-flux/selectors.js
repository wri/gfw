import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';
// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getColors = (state) => state.colors;
const getIndicator = (state) => state.indicator;
const getLocationName = (state) => state.locationLabel;
const getSentences = (state) => state.sentences;

export const parseData = createSelector(
  [getData, getSettings],
  (totalData, settings) => {
    if (!totalData) return null;
    const { startYear, endYear } = settings;

    // TODO: return as object
    return [
      totalData.length &&
        Object.keys(totalData[0]).reduce((result, k) => {
          result[k] = totalData[0][k] / (endYear - startYear);
          return result;
        }, {}),
    ];
  }
);

export const parseConfig = createSelector(
  [parseData, getColors],
  (data, colors) => {
    if (!data || isEmpty(data)) return null;
    const {
      carbonFlux: { emissions, netCarbonFlux, removals },
    } = colors;

    const maxValue =
      Math.abs(
        Object.values(data[0]).reduce((a, b) => (data[a] > data[b] ? b : a))
      ) * 1.2;

    const { flux: netFluxData } = data[0];

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
        tickFormatter: (value) => format('.2r')(value * 1e-9),
        label: {
          value: 'GtCO\u2082e/year',
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
              content: (props) => {
                // eslint-disable-next-line react/prop-types
                const { x, y, width, height, offset } = props;
                return (
                  <g transform={`translate(0 ${height / 2 + offset})`}>
                    <text
                      x={x + width + offset}
                      y={y}
                      textAnchor="start"
                      fill="#000"
                      fontSize={screen.width > 300 ? 16 : 10}
                    >
                      EMISSIONS
                    </text>
                  </g>
                );
              },
            },
          },
          removals: {
            fill: removals,
            background: false,
            stackId: 2,
            labelList: {
              content: (props) => {
                // eslint-disable-next-line react/prop-types
                const { x, y, offset, width, height } = props;
                return (
                  <g transform={`translate(0 ${height / 2 + offset})`}>
                    <text
                      x={x + width - offset}
                      y={y}
                      textAnchor="end"
                      fill="#000"
                      fontSize={screen.width > 300 ? 16 : 10}
                    >
                      REMOVALS
                    </text>
                  </g>
                );
              },
            },
          },
          flux: {
            fill: netCarbonFlux,
            background: false,
            labelList: {
              content: (props) => {
                // eslint-disable-next-line react/prop-types
                const { x, y, width, height, offset } = props;
                return (
                  <g transform={`translate(0 ${height / 2 + offset})`}>
                    <text
                      x={x + width - offset}
                      y={y}
                      textAnchor="end"
                      fill="#000"
                      fontSize={screen.width > 300 ? 16 : 10}
                    >
                      {netFluxData > 0 ? 'NET EMISSIONS' : 'NET REMOVALS'}
                    </text>
                  </g>
                );
              },
            },
          },
        },
      },
      referenceLine: { x: 0, stroke: '#606060', strokeWidth: 2 },
      tooltip: [
        {
          label: 'Carbon flux (per year)',
        },
        {
          key: 'emissions',
          label: 'Emissions',
          unitFormat: (value) => `${format('.3s')(value)}tCO\u2082e`,
          color: emissions,
        },
        {
          key: 'removals',
          label: 'Removals',
          unitFormat: (value) => `${format('.3s')(value)}tCO\u2082e`,
          color: removals,
        },
        {
          key: 'flux',
          label: 'Net',
          unitFormat: (value) => `${format('.3s')(value)}tCO\u2082e`,
          color: netCarbonFlux,
        },
      ],
    };
  }
);

export const parseSentence = createSelector(
  [getData, getSentences, getIndicator, getLocationName],
  (data, sentences, indicator, locationName) => {
    if (!data || isEmpty(data)) return null;

    const { initial, withIndicator } = sentences;

    const startYear = 2001;
    const endYear = 2020;
    const { emissions, removals, flux } = data[0];

    const params = {
      indicator: indicator && indicator.label,
      startYear,
      endYear,
      location: locationName,
      totalEmissions: formatNumber({
        num: emissions,
        unit: 'tCO2',
      }),
      totalRemovals: formatNumber({
        num: removals,
        unit: 'tCO2',
      }),
      totalFlux: formatNumber({
        num: flux,
        unit: 'tCO2',
      }),
    };
    return {
      sentence: indicator ? withIndicator : initial,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
});
