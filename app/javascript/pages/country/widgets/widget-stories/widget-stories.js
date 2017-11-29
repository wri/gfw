import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetStoriesComponent from './widget-stories-component';
import actions from './widget-stories-actions';

export { initialState } from './widget-stories-reducers';
export { default as reducers } from './widget-stories-reducers';
export { default as actions } from './widget-stories-actions';

const mapStateToProps = state => ({
  totalAmount: 'Nan',
  percentage: 'Nan',
  startYear: 2011,
  endYear: 2014
});

const WidgetStoriesContainer = props =>
  createElement(WidgetStoriesComponent, {
    ...props
  });

export default connect(mapStateToProps, actions)(WidgetStoriesContainer);
