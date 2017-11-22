import { createElement } from 'react';
import { connect } from 'react-redux';

import { getTreeLossByYear } from 'services/tree-loss';

import WidgetTreeLossComponent from './widget-tree-loss-component';
import actions from './widget-tree-loss-actions';

export { initialState } from './widget-tree-loss-reducers';
export { default as reducers } from './widget-tree-loss-reducers';
export { default as actions } from './widget-tree-loss-actions';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeLoss.isLoading,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  total: state.widgetTreeLoss.total,
  years: state.widgetTreeLoss.years,
  yearsLoss: state.widgetTreeLoss.yearsLoss,
  locations: state.widgetTreeLoss.locations,
  units: state.widgetTreeLoss.units,
  canopies: state.widgetTreeLoss.canopies,
  settings: state.widgetTreeLoss.settings
});

const WidgetTreeLossContainer = props => {
  const updateData = props => {
    props.setTreeLossIsLoading(true);
    setWidgetData(props);
  };

  const setInitialData = props => {
    setWidgetData(props);
  };

  const setWidgetData = props => {
    const percentageValues = [];
    getTreeLossByYear(
      props.iso,
      props.countryRegion,
      { minYear: props.settings.startYear, maxYear: props.settings.endYear },
      props.settings.canopy
    ).then(response => {
      const total = response.data.data.reduce((accumulator, item) => (
        (typeof accumulator === 'object' ? accumulator.value : accumulator) +
          item.value
      ));
      if (props.settings.unit !== 'Ha') {
        response.data.data.forEach((item) => {
          percentageValues.push({
            value: item.value / Math.round(props.countryData.area_ha) * 100,
            label: item.date
          });
        });
      }
      const values = {
        total:
          props.settings.unit === 'Ha'
            ? total
            : total / Math.round(props.countryData.area_ha) * 100,
        years:
          props.settings.unit === 'Ha' ? response.data.data : percentageValues
      };
      props.setTreeLossValues(values);
    });
  };

  const viewOnMap = () => {
    props.setLayers(['loss']);
  };

  return createElement(WidgetTreeLossComponent, {
    ...props,
    setInitialData,
    viewOnMap,
    updateData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
