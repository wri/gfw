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
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  minYear: state.widgetTreeLoss.minYear,
  maxYear: state.widgetTreeLoss.maxYear,
  thresh: state.widgetTreeLoss.thresh,
  total: state.widgetTreeLoss.total,
  years: state.widgetTreeLoss.years
});

const WidgetTreeLossContainer = (props) => {
  const setInitialData = (props) => {
    getTreeLossByYear(
      props.iso,
      props.countryRegion,
      {minYear: props.minYear, maxYear: props.maxYear},
      props.thresh
    )
      .then((response) => {
        const values = {
          total: response.data.data.reduce(function(accumulator, item) {
            return (typeof accumulator === 'object' ? accumulator.value : accumulator) + item.value;
          }),
          years: response.data.data
        };
        props.setTreeLossValues(values);
      });
  };

  return createElement(WidgetTreeLossComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
