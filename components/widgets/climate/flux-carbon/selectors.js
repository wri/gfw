import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';

import { formatNumber } from 'utils/format';
import {
  yearTicksFormatter,
  zeroFillYears,
} from 'components/widgets/utils/data';

// get list data
const getData = (state) => state.data && state.data.loss;
const getSettings = (state) => state.settings;
const getColors = (state) => state.colors;
const getIndicator = (state) => state.indicator;
const getLocationName = (state) => state.locationLabel;
const getSentences = (state) => state.sentences;

export const parseData = createSelector(
  [getData, getSettings],
  (old_data, settings) => {
    if (isEmpty(old_data)) return null;
    console.log(settings, 'flux');
    const data = [
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2001,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2002,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2003,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2004,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2005,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2006,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2007,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2008,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2009,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2010,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2011,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2012,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2013,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 875674232.5882894,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2014,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1034754070.8924707,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2015,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1314577679.1050954,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2016,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1373967899.3919582,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2017,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1091660629.379034,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2018,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1212749268.005095,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2019,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 907211582.5373274,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2020,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
    ];
    const { startYear, endYear, yearsRange, gasesIncluded } = settings;
    const years = yearsRange && yearsRange.map((yearObj) => yearObj.value);
    const fillObj = {
      area: 0,
      biomassLoss: 0,
      bound1: null,
      emissions: 0,
      percentage: 0,
    };
    const zeroFilledData = zeroFillYears(
      data,
      startYear,
      endYear,
      years,
      fillObj
    );
    return (
      zeroFilledData &&
      zeroFilledData
        .filter(
          (d) => d.umd_tree_cover_loss__year >= startYear && d.year <= endYear
        )
        .map((d) => ({
          ...d,
          emissions: d[gasesIncluded],
        }))
    );
  }
);

export const parseConfig = createSelector(
  [getColors, getSettings],
  (colors, settings) => {
    const { climate } = colors;
    const { gasesIncluded } = settings;
    let emissionLabel = 'Emissions';
    if (gasesIncluded !== 'allGases') {
      emissionLabel +=
        gasesIncluded === 'co2Only' ? ' (CO\u2082)' : ' (non-CO\u2082)';
    }
    return {
      height: 250,
      layout: 'vertical',
      xKey: 'umd_tree_cover_loss__year',
      yKeys: {
        bars: {
          emissions: {
            fill: climate.emissions,
            background: false,
            stackId: 1,
          },
          netCarbonFlux: {
            fill: climate.netCarbonFlux,
            background: false,
          },
          removals: {
            fill: climate.removals,
            background: false,
            stackId: 1,
          },
        },
      },
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
          color: climate.main,
        },
      ],
      unit: 't CO2e',
      unitFormat: (value) => format('.2s')(value),
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getSettings, getIndicator, getSentences, getLocationName],
  (old_data, settings, indicator, sentences, locationName) => {
    const data = [
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2001,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2002,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2003,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2004,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2005,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2006,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2007,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2008,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2009,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2010,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2011,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2012,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 842272501.2011116,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2013,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 875674232.5882894,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2014,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1034754070.8924707,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2015,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1314577679.1050954,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2016,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1373967899.3919582,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2017,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1091660629.379034,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2018,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 1212749268.005095,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2019,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
      {
        iso: 'BRA',
        emissions: 907211582.5373274,
        umd_tree_cover_loss__ha: 2746361.5567,
        umd_tree_cover_loss__year: 2020,
        gfw_gross_emissions_co2e_all_gases__Mg: 0,
        whrc_aboveground_biomass_loss__Mg: 661499600.730052,
        whrc_aboveground_co2_emissions__Mg: 907211582.5373,
      },
    ];
    if (!data || isEmpty(data)) return null;
    const { initial, co2Only, nonCo2Only } = sentences;
    const { startYear, endYear, gasesIncluded } = settings;
    const totalBiomass = data
      .map((d) => d.emissions)
      .reduce((sum, d) => (d ? sum + d : sum));

    let indicatorText = '';
    if (indicator && indicator.value === 'mining') {
      indicatorText = ` ${indicator.label} regions`;
    } else if (indicator) {
      indicatorText = ` ${indicator.label}`;
    }

    let emissionString = '.';
    if (gasesIncluded !== 'allGases') {
      emissionString = gasesIncluded === 'co2Only' ? co2Only : nonCo2Only;
    }
    const sentence = initial + emissionString;

    const params = {
      value: `${formatNumber({ num: totalBiomass, unit: 't' })} of CO\u2082e`,
      location: locationName,
      annualAvg: formatNumber({ num: totalBiomass / data.length, unit: 't' }),
      startYear,
      endYear,
      indicatorText,
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
});
