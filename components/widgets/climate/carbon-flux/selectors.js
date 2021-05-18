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
          result[k] = totalData[0][k] / (endYear - startYear + 1);
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
      carbonFlux: { emissions, netEmissions, removals, netRemovals },
    } = colors;

    const maxValue = Math.ceil(
      Math.abs(
        Object.values(data[0]).reduce((a, b) => (data[a] > data[b] ? b : a))
        ) * 1.2
      );

    const {
      emissions: emissionsData,
      removals: removalsData,
      flux: netFluxData,
    } = data[0];

    const ticks = 6;


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
        domain: [-maxValue - 100000000, maxValue + 100000000],
        allowDecimals: false,
        // TODO: 0.5 interval ticks
        ticks: Array.from({ length: ticks + 1 }, (v, k) =>
          Math.ceil((2 * k * maxValue) / ticks - maxValue)
        ),
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
                      x={
                        emissionsData > 0
                          ? x + width + offset
                          : x + width - offset
                      }
                      y={y}
                      textAnchor={emissionsData > 0 ? 'start' : 'end'}
                      fill="#000"
                      fontSize={14}
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
                      x={
                        removalsData > 0
                          ? x + width + offset
                          : x + width - offset
                      }
                      y={y}
                      textAnchor={removalsData > 0 ? 'start' : 'end'}
                      fill="#000"
                      fontSize={14}
                    >
                      REMOVALS
                    </text>
                  </g>
                );
              },
            },
          },
          flux: {
            fill: netFluxData > 0 ? netEmissions : netRemovals,
            background: false,
            labelList: {
              content: (props) => {
                // eslint-disable-next-line react/prop-types
                const { x, y, width, height, offset } = props;
                return (
                  <g transform={`translate(0 ${height / 2 + offset})`}>
                    <text
                      x={
                        netFluxData > 0
                          ? x + width + offset
                          : x + width - offset
                      }
                      y={y}
                      textAnchor={netFluxData > 0 ? 'start' : 'end'}
                      fill="#000"
                      fontSize={14}
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
          key: 'removals',
          label: 'Removals',
          unitFormat: (value) => `${format('.3s')(value)}tCO\u2082e`,
          color: removals,
        },
        {
          key: 'emissions',
          label: 'Emissions',
          unitFormat: (value) => `${format('.3s')(value)}tCO\u2082e`,
          color: emissions,
        },
        {
          key: 'flux',
          label: netFluxData > 0 ? 'Net emissions' : 'Net removals',
          unitFormat: (value) => `${format('.3s')(value)}tCO\u2082e`,
          color: netFluxData > 0 ? netEmissions : netRemovals,
        },
      ],
    };
  }
);

export const parseSentence = createSelector(
  [getData, getSentences, getIndicator, getLocationName, getSettings],
  (data, sentences, indicator, locationName, settings) => {
    if (!data || isEmpty(data)) return null;

    const { initial, withIndicator } = sentences;
    const { startYear, endYear } = settings;

    const yearTotal = endYear - startYear + 1;
    const { emissions, removals, flux } = data[0];

    const params = {
      indicator: indicator && indicator.label,
      startYear,
      endYear,
      location: locationName,
      totalEmissions: formatNumber({
        num: emissions / yearTotal,
        unit: 'tCO2',
      }),
      totalRemovals: formatNumber({
        num: removals / yearTotal,
        unit: 'tCO2',
      }),
      totalFlux: formatNumber({
        num: flux / yearTotal,
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
