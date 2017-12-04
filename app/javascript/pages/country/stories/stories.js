import { createElement } from 'react';
import { connect } from 'react-redux';

import StoriesComponent from './stories-component';
import actions from './stories-actions';

export { initialState } from './stories-reducers';
export { default as reducers } from './stories-reducers';
export { default as actions } from './stories-actions';

const mapStateToProps = () => ({
  totalAmount: 'Nan',
  percentage: 'Nan',
  startYear: 2011,
  endYear: 2014
});

const StoriesContainer = props =>
  createElement(StoriesComponent, {
    ...props
  });

export default connect(mapStateToProps, actions)(StoriesContainer);
