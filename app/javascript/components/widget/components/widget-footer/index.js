import { connect } from 'react-redux';

import Component from './component';

import { getWidgetFooterProps } from './selectors';

const makeMapStateToProps = () => {
  const getWidgetPropsObject = getWidgetFooterProps();
  const mapStateToProps = (state, props) => ({
    ...getWidgetPropsObject(props)
  });
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(Component);
