import { createElement } from 'react';
import { connect } from 'react-redux';

import { getTreeLossByYear } from 'services/tree-loss';

import WidgetTreeLossComponent from './widget-tree-loss-component';
import actions from './widget-tree-loss-actions';

export { initialState } from './widget-tree-loss-reducers';
export { default as reducers } from './widget-tree-loss-reducers';
export { default as actions } from './widget-tree-loss-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  areaHa: state.countryData.geostore.areaHa,
  isLoading: state.widgetTreeLoss.isLoading,
  total: state.widgetTreeLoss.total,
  years: state.widgetTreeLoss.years,
  yearsLoss: state.widgetTreeLoss.yearsLoss,
  locations: state.widgetTreeLoss.locations,
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
    const { location, settings, setTreeLossValues } = newProps;

    getTreeLossByYear(
      location.admin0,
      location.admin1,
      {
        minYear: settings.startYear,
        maxYear: settings.endYear
      },
      settings.canopy
    ).then(response => {
      const total =
        response.data.data.length &&
        response.data.data.reduce(
          (accumulator, item) =>
            (typeof accumulator === 'object'
              ? accumulator.value
              : accumulator) + item.value
        );
      const values = {
        total,
        years: response.data.data
      };
      setTreeLossValues(values);
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
