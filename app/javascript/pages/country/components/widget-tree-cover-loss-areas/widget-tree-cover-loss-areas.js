import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetTreeCoverLossAreasComponent from './widget-tree-cover-loss-areas-component';
import actions from './widget-tree-cover-loss-areas-actions';

export { initialState } from './widget-tree-cover-loss-areas-reducers';
export { default as reducers } from './widget-tree-cover-loss-areas-reducers';
export { default as actions } from './widget-tree-cover-loss-areas-actions';

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

const WidgetTreeCoverLossAreasContainer = (props) => {
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
              props.setTreeCoverLossAreasValues(values);
          });
      });
  };

  return createElement(WidgetTreeCoverLossAreasComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverLossAreasContainer);
