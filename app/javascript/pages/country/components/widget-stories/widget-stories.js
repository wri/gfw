import { createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import WidgetStoriesComponent from './widget-stories-component';
import actions from './widget-stories-actions';

export { initialState } from './widget-stories-reducers';
export { default as reducers } from './widget-stories-reducers';
export { default as actions } from './widget-stories-actions';

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

const WidgetStoriesContainer = (props) => {
  return createElement(WidgetStoriesComponent, {
    ...props
  });
};

export default withRouter(connect(mapStateToProps, actions)(WidgetStoriesContainer));
