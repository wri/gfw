import { createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import WidgetTreeCoverGainComponent from './widget-tree-cover-gain-component';
import actions from './widget-tree-cover-gain-actions';

export { initialState } from './widget-tree-cover-gain-reducers';
export { default as reducers } from './widget-tree-cover-gain-reducers';
export { default as actions } from './widget-tree-cover-gain-actions';

const mapStateToProps = state => ({
  iso: state.root.iso,
  countriesList: state.root.countriesList,
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions,
  totalAmount: 'Nan',
  percentage: 'Nan',
  startYear: 2011,
  endYear: 2014
});

const WidgetTreeCoverGainContainer = (props) => {
  return createElement(WidgetTreeCoverGainComponent, {
    ...props
  });
};

export default withRouter(connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer));
