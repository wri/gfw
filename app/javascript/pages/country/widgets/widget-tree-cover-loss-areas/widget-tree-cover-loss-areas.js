import { createElement } from 'react';
import { connect } from 'react-redux';

import { getTreeLossByRegion } from 'services/tree-loss';

import WidgetTreeCoverLossAreasComponent from './widget-tree-cover-loss-areas-component';
import actions from './widget-tree-cover-loss-areas-actions';

export { initialState } from './widget-tree-cover-loss-areas-reducers';
export { default as reducers } from './widget-tree-cover-loss-areas-reducers';
export { default as actions } from './widget-tree-cover-loss-areas-actions';

const mapStateToProps = state => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading,
    isGeostoreLoading
  } = state.countryData;
  return {
    location: state.location.payload,
    admin1List: state.countryData.regions,
    areaHa: state.countryData.geostore.areaHa,
    isLoading: state.widgetTreeCoverLossAreas.isLoading,
    regionData: state.widgetTreeCoverLossAreas.regionData,
    regionChartData: state.widgetTreeCoverLossAreas.regionChartData,
    startYear: 2001,
    endYear: 2015,
    thresh: 30,
    paginate: state.widgetTreeCoverLossAreas.paginate,
    regions: state.widgetTreeCoverLossAreas.regions,
    units: state.widgetTreeCoverLossAreas.units,
    canopies: state.widgetTreeCoverLossAreas.canopies,
    settings: state.widgetTreeCoverLossAreas.settings,
    years: state.widgetTreeCoverLossAreas.years,
    isMetaLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isGeostoreLoading
  };
};

const colors = [
  '#510626',
  '#730735',
  '#af0f54',
  '#f5247e',
  '#f3599b',
  '#fb9bc4',
  '#f1c5d8',
  '#e9e7a6',
  '#dad781',
  '#cecb65',
  '#d1d1d1'
];

const WidgetTreeCoverLossAreasContainer = props => {
  const updateData = newProps => {
    newProps.setTreeCoverLossAreasIsLoading(true);
    setWidgetData(newProps);
  };

  const setInitialData = newProps => {
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    const {
      location,
      regions,
      areaHa,
      settings,
      paginate,
      setPieChartDataTotal,
      setPieCharDataDistricts
    } = newProps;

    getTreeLossByRegion(
      location.admin0,
      { minYear: settings.startYear, maxYear: settings.endYear },
      settings.canopy
    ).then(treeLossByRegion => {
      const regionsForestLoss = [];
      const regionForestLossChart = [];

      let indexColors = 0;
      let othersValue = 0;
      treeLossByRegion.data.data.forEach((item, index) => {
        const region = regions.find(r => item.adm1 === r.value) || null;
        if (region) {
          regionsForestLoss.push({
            name: region.label,
            value:
              settings.unit === 'ha'
                ? item.value
                : item.value / Math.round(areaHa) * 100,
            color: colors[indexColors],
            position: index + 1
          });
        }

        if (indexColors < paginate.limit) {
          regionForestLossChart.push({
            name: region.name,
            color: colors[indexColors],
            value:
              settings.unit === 'ha'
                ? item.value
                : item.value / Math.round(areaHa) * 100
          });
          indexColors += 1;
        } else if (index === treeLossByRegion.data.data.length - 1) {
          regionForestLossChart.push({
            name: 'others',
            color: colors[indexColors],
            value:
              settings.unit === 'ha'
                ? othersValue
                : othersValue / Math.round(areaHa) * 100
          });
        } else {
          othersValue += item.value;
        }
      });

      setPieChartDataTotal(regionForestLossChart);
      setPieCharDataDistricts(regionsForestLoss);
    });
  };

  const nextPage = () => {
    props.setTreeCoverLossAreasPage(props.paginate.page + 1);
  };

  const previousPage = () => {
    props.setTreeCoverLossAreasPage(props.paginate.page - 1);
  };

  return createElement(WidgetTreeCoverLossAreasComponent, {
    ...props,
    setInitialData,
    updateData,
    nextPage,
    previousPage
  });
};

export default connect(mapStateToProps, actions)(
  WidgetTreeCoverLossAreasContainer
);
