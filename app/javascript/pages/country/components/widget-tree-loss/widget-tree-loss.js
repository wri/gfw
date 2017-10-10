import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetTreeLossComponent from './widget-tree-loss-component';
import actions from './widget-tree-loss-actions';

export { initialState } from './widget-tree-loss-reducers';
export { default as reducers } from './widget-tree-loss-reducers';
export { default as actions } from './widget-tree-loss-actions';

import {
  getTreeLossByYear
} from '../../../../services/tree-loss';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeLoss.isLoading,
  isUpdating: state.widgetTreeLocated.isUpdating,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  minYear: state.widgetTreeLoss.minYear,
  maxYear: state.widgetTreeLoss.maxYear,
  thresh: state.widgetTreeLoss.thresh,
  total: state.widgetTreeLoss.total,
  years: state.widgetTreeLoss.years,
  yearsLoss: state.widgetTreeLoss.yearsLoss,
  regions: state.widgetTreeLoss.regions,
  units: state.widgetTreeLoss.units,
  canopies: state.widgetTreeLoss.canopies,
  settings: state.widgetTreeLoss.settings
});

const WidgetTreeLossContainer = (props) => {

  const updateData = (props) => {
    props.setTreeLossIsUpdating(true);
    setWidgetData(props);
  };

  const setInitialData = (props) => {
    setWidgetData(props);
  };

  const setWidgetData = (props) => {
    getTreeLossByYear(
      props.iso,
      props.countryRegion,
      {minYear: props.settings.startYear, maxYear: props.settings.endYear},
      props.settings.canopy
    )
      .then((response) => {
        const total = response.data.data.reduce(function(accumulator, item) {
          return (typeof accumulator === 'object' ? accumulator.value : accumulator) + item.value;
        });
        const values = {
          total: props.settings.unit === 'Ha' ? total : (total /  Math.round(props.countryData.area_ha)) * 100,
          years: response.data.data
        };
        props.setTreeLossValues(values);
      });
  };

  const viewOnMap = () => {
    props.setLayer('loss');
  };

  return createElement(WidgetTreeLossComponent, {
    ...props,
    setInitialData,
    viewOnMap,
    updateData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
