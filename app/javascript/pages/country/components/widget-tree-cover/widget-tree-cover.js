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
  totalCover: state.widgetTreeCover.totalCover,
  totalIntactForest: state.widgetTreeCover.totalIntactForest,
  totalNonForest: state.widgetTreeCover.totalNonForest
});

const WidgetTreeCoverContainer = (props) => {
  const setInitialData = (props) => {
    getTotalCover(props.iso, props.countryRegion)
      .then((response) => {
        console.log(response);

        getTotalIntactForest(props.iso, props.countryRegion)
          .then((response) => {
            console.log(response);
            //props.setCountriesList(response.data.data);
          });
      });

  };

  return createElement(WidgetTreeCoverComponent, {
    ...props,
    setInitialData
  });
};

export default withRouter(connect(mapStateToProps, actions)(WidgetTreeCoverContainer));
