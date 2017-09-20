import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetTreeCoverLossComponent from './widget-tree-cover-loss-component';
import actions from './widget-tree-cover-loss-actions';

export { initialState } from './widget-tree-cover-loss-reducers';
export { default as reducers } from './widget-tree-cover-loss-reducers';
export { default as actions } from './widget-tree-cover-loss-actions';

import {
  getCoverLossByYear
} from '../../../../services/tree-cover-loss';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeCoverLoss.isLoading,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  minYear: state.widgetTreeCoverLoss.minYear,
  maxYear: state.widgetTreeCoverLoss.maxYear,
  thresh: state.widgetTreeCoverLoss.thresh,
  total: state.widgetTreeCoverLoss.total,
  years: state.widgetTreeCoverLoss.years
});

const WidgetTreeCoverLossContainer = (props) => {
  const setInitialData = (props) => {
    getCoverLossByYear(
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
        props.setTreeCoverLossValues(values);
      });
  };

  return createElement(WidgetTreeCoverLossComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverLossContainer);
