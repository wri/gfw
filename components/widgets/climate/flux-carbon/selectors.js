import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';


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
  (data, colors) => {
    const  {
      fluxCarbon: {
        emissions,
        netCarbonFlux,
        removals
      }
    } = colors;
    if (!data) return null;
    const { removals: removalsValue, emissions: emissionsValue }  = data[0];
    return {
      height: 250,
      margin: {
        bottom: 40
      },
      yAxis: {
        hide: true,
        type: 'category',
      },
      xAxis: {
        type: 'number',
        domain: [-300, 300],
        label: {
          value: 'GtCO2/year',
          fontSize: "14px",
          position: "bottom"
        },
      },
      yKey: 'name',
      xKeys: {
        bars: {
          emissions: {
            value: [0, emissionsValue],
            x: 0,
            fill: emissions,
            background: false,
            stackId: 2,
          },
          flux: {
            fill: netCarbonFlux,
            background: false,
          },
          removals: {
            value: -[removalsValue, 0],
            x: (removalsValue / 2),
            fill: removals,
            background: false,
            stackId: 2,
            shape: ({ y, width, height, fill }) => {
              return (
                <g>
                  <rect
                    x={width / 2}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                  />
                </g>
              );
            },
            // transform: (props) => console.log(props, 'props') ||`translate(${-((removalsValue + emissionsValue))}, 0)`
          },
        },
      },
      referenceLine: { x: 0, stroke: '#606060', strokeWidth: 2 },
      // xAxis: {
      //   tickFormatter: yearTicksFormatter,
      // },
      tooltip: [
        {
          key: 'flux',
          unit: 'GtCO2/year',
          unitFormat: (value) => format('.3s')(value),
          color: emissions,
        },
        {
          key: 'emissions',
          unit: 'GtCO2/year',
          unitFormat: (value) => format('.3s')(value),
          color: emissions,
        },
      ],
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getSettings, getIndicator, getSentences, getLocationName],
  (data, settings, indicator, sentences, locationName) => {
    if (!data || isEmpty(data)) return null;

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
