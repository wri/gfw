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
  admin1: state.root.admin1,
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
  const updateData = newProps => {
    newProps.setTreeLossIsLoading(true);
    setWidgetData(newProps);
  };

  const setInitialData = newProps => {
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    const percentageValues = [];
    getTreeLossByYear(
      newProps.iso,
      newProps.admin1,
      { minYear: newProps.settings.startYear, maxYear: newProps.settings.endYear },
      newProps.settings.canopy
    ).then(response => {
      const total = response.data.data.reduce((accumulator, item) => (
        (typeof accumulator === 'object' ? accumulator.value : accumulator) +
          item.value
      ));
      if (newProps.settings.unit !== 'ha') {
        response.data.data.forEach((item) => {
          percentageValues.push({
            value: item.value / Math.round(newProps.countryData.area_ha) * 100,
            label: item.date
          });
        });
      }
      const values = {
        total:
        newProps.settings.unit === 'ha'
          ? total
          : total / Math.round(newProps.countryData.area_ha) * 100,
        years:
        newProps.settings.unit === 'ha' ? response.data.data : percentageValues
      };
      newProps.setTreeLossValues(values);
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
