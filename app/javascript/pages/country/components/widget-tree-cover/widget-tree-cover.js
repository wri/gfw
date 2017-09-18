import { createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

import {
  getTotalCover,
  getTotalIntactForest
} from '../../../../services/tree-cover';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeCover.isLoading,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  totalCover: state.widgetTreeCover.totalCover,
  totalIntactForest: state.widgetTreeCover.totalIntactForest,
  totalNonForest: state.widgetTreeCover.totalNonForest
});

const WidgetTreeCoverContainer = (props) => {
  const setInitialData = (props) => {
    getTotalCover(props.iso, props.countryRegion)
      .then((totalCoverResponse) => {
        getTotalIntactForest(props.iso, props.countryRegion)
          .then((totalIntactForestResponse) => {
            const totalCover = Math.round(totalCoverResponse.data.data[0].value),
              totalIntactForest = Math.round(totalIntactForestResponse.data.data[0].value),
              values = {
                totalCover: totalCover,
                totalIntactForest: totalIntactForest,
                totalNonForest: Math.round(props.countryData.area_ha) - (totalCover + totalIntactForest)
              };
              props.setValues(values);
          });
      });
  };

  return createElement(WidgetTreeCoverComponent, {
    ...props,
    setInitialData
  });
};

export default withRouter(connect(mapStateToProps, actions)(WidgetTreeCoverContainer));
