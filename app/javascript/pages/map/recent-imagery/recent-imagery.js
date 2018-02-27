import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './recent-imagery-actions';
import reducers, { initialState } from './recent-imagery-reducers';
import RecentImageryComponent from './recent-imagery-component';

const mapStateToProps = ({ recentImagery }) => {
  const { enabled } = recentImagery;
  return {
    enabled
  };
};

class RecentImageryContainer extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { enabled } = nextProps;

    if (enabled && !isEqual(enabled, this.props.enabled)) {
      this.showLayer();
    }
  }

  showLayer = () => {};

  render() {
    return createElement(RecentImageryComponent, {
      ...this.props
    });
  }
}

RecentImageryContainer.propTypes = {
  enabled: PropTypes.bool
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(RecentImageryContainer);
