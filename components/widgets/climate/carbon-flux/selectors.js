import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';

const getTitle = (state) => state.title;
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getColors = (state) => state.colors;
const getIndicator = (state) => state.indicator;
const getLocationName = (state) => state.locationLabel;
const getSentences = (state) => state.sentences;
const getAdminLevel = (state) => state.adminLevel;
const getIsSimple = (state) => state.pathname.includes('map');

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
  [parseData, getColors, getIsSimple],
  (data, colors, simple) => {
    if (!data || isEmpty(data)) return null;
    const {
      carbonFlux: { emissions, netEmissions, removals, netRemovals },
    } = colors;

    const {
      emissions: emissionsData,
      flux: netFluxData,
      removals: removalsData,
    } = data[0];

    const maxValue = Math.ceil(
      Math.max(...Object.values(data[0]).map((d) => Math.abs(d))) * 1.2 // * 1.2 to increase maxValue a bit as it's just used for ticks and domain
    );

    // get number digits (just to be able to operate with them)
    const maxValueDigits = maxValue.toString().length - 1;

    // format numbers to operate with array (it's just to make operations more simple, it'll get changed back after operations)
    const tickFormatter = (value) =>
      formatNumber({
        num: value * `1e-${maxValueDigits}`,
        specialSpecifier: '.2r',
      });

    // make ticks multiple of 0.5 (client request a step of 0.5 within ticks)
    const tick = Math.ceil(tickFormatter(maxValue) / 0.5) * 0.5;

    // calculate ticks array
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );

    const ticks = Array.from(range(-tick, tick, 0.5)).map(
      (t) => t * `1e+${maxValueDigits}`
    );

    return {
      height: 250,
      stackOffset: 'sign',
      simpleNeedsAxis: true,
      clearMargins: true,
      ...(simple && {
        simpleLegend: [
          { value: 'REMOVALS', type: 'circle', color: removals },
          { value: 'EMISSIONS', type: 'circle', color: emissions },
          {
            value: 'FLUX',
            type: 'circle',
            color: netFluxData > 0 ? netEmissions : netRemovals,
          },
        ],
      }),
      ...(!simple && {
        margin: {
          left: window.innerWidth > 300 ? 85 : 98, // margin adapted to not cut off label
          right: 85,
          bottom: 40,
        },
      }),
      yAxis: {
        hide: true,
        type: 'category',
      },
      xAxis: {
        type: 'number',
        domain: [ticks[0], ticks[ticks.length - 1]],
        allowDecimals: false,
        ticks,
        tickFormatter: (value) =>
          formatNumber({ num: value * 1e-9, specialSpecifier: '.2r' }),
        label: {
          value: 'GtCO\u2082e/year',
          fontSize: 14,
          position: 'bottom',
        },
      },
      xKeys: {
        bars: {
          emissions: {
            fill: emissions,
            background: false,
            isAnimationActive: false,
            stackId: 2,
            ...(!simple && {
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
                        fontSize={window.innerWidth > 300 ? 14 : 10}
                      >
                        EMISSIONS
                      </text>
                    </g>
                  );
                },
              },
            }),
          },
          removals: {
            fill: removals,
            background: false,
            stackId: 2,
            isAnimationActive: false,
            ...(!simple && {
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
                        fontSize={window.innerWidth > 300 ? 14 : 10}
                      >
                        REMOVALS
                      </text>
                    </g>
                  );
                },
              },
            }),
          },
          flux: {
            fill: netFluxData > 0 ? netEmissions : netRemovals,
            background: false,
            isAnimationActive: false,
            ...(!simple && {
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
                        fontSize={window.innerWidth > 300 ? 14 : 10}
                      >
                        {netFluxData > 0 ? 'NET EMISSIONS' : 'NET REMOVALS'}
                      </text>
                    </g>
                  );
                },
              },
            }),
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
          unitFormat: (value) =>
            formatNumber({ num: value, unit: 'tCO2', spaceUnit: true }),
          color: removals,
        },
        {
          key: 'emissions',
          label: 'Emissions',
          unitFormat: (value) =>
            formatNumber({ num: value, unit: 'tCO2', spaceUnit: true }),
          color: emissions,
        },
        {
          key: 'flux',
          label: netFluxData > 0 ? 'Net emissions' : 'Net removals',
          unitFormat: (value) =>
            formatNumber({ num: value, unit: 'tCO2', spaceUnit: true }),
          color: netFluxData > 0 ? netEmissions : netRemovals,
        },
      ],
    };
  }
);

export const parseSentence = createSelector(
  [
    getData,
    getSentences,
    getIndicator,
    getLocationName,
    getSettings,
    getAdminLevel,
  ],
  (data, sentences, indicator, locationName, settings, adminLevel) => {
    if (!data || isEmpty(data)) return null;

    const { globalInitial, globalWithIndicator, initial, withIndicator } =
      sentences;
    const { startYear, endYear, sentence: sentenceSettings } = settings;
    const { netCarbonFlux: netCarbonFluxWording } = sentenceSettings;

    const yearTotal = endYear - startYear + 1;
    const { emissions, removals, flux } = data[0];
    const totalFlux = flux / yearTotal;

    let fluxWording = netCarbonFluxWording.neutral;
    if (totalFlux > 0) fluxWording = netCarbonFluxWording.positive;
    if (totalFlux < 0) fluxWording = netCarbonFluxWording.negative;

    const params = {
      netCarbonFluxWording: fluxWording,
      indicator: indicator && indicator.label,
      startYear,
      endYear,
      location: locationName,
      totalEmissions: formatNumber({
        num: emissions / yearTotal,
        unit: 'tCO2',
        spaceUnit: true,
      }),
      totalRemovals: formatNumber({
        num: removals / yearTotal,
        unit: 'tCO2',
        spaceUnit: true,
      }),
      totalFlux: formatNumber({
        num: flux / yearTotal,
        unit: 'tCO2',
        spaceUnit: true,
      }),
    };

    let sentence;

    switch (adminLevel) {
      case 'adm0':
      case 'adm1':
      case 'adm2':
        sentence = indicator ? withIndicator : initial;
        break;
      default:
        sentence = indicator ? globalWithIndicator : globalInitial;
    }
    return {
      sentence,
      params,
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    return name === 'global' ? title.global : title.default;
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
  title: parseTitle,
});
