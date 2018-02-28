import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './recent-imagery-actions';
import reducers, { initialState } from './recent-imagery-reducers';
import RecentImageryComponent from './recent-imagery-component';

const mapStateToProps = ({ recentImagery }) => {
  const { enabled, needEvents } = recentImagery;
  return {
    enabled,
    needEvents
  };
};

class RecentImageryContainer extends PureComponent {
  componentDidMount() {
    this.middleView = window.App.Views.ReactMapMiddleView;
  }

  componentWillReceiveProps(nextProps) {
    const { enabled, needEvents, setLayer, setEvents } = nextProps;
    const { map } = this.middleView;
    if (enabled && !isEqual(enabled, this.props.enabled)) {
      setLayer({
        middleView: this.middleView,
        latitude: map.getCenter().lng(),
        longitude: map.getCenter().lat(),
        start: '2016-01-01',
        end: '2016-09-01'
      });
    }
    if (needEvents && !isEqual(needEvents, this.props.setEvents)) {
      setEvents({
        middleView: this.middleView
      });
    }
  }

  render() {
    return createElement(RecentImageryComponent, {
      ...this.props
    });
  }
}

RecentImageryContainer.propTypes = {
  enabled: PropTypes.bool,
  needEvents: PropTypes.bool,
  setLayer: PropTypes.func,
  setEvents: PropTypes.func
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(RecentImageryContainer);
