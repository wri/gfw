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
  componentDidMount() {
    this.middleView = window.App.Views.ReactMapMiddleView;
  }

  componentWillReceiveProps(nextProps) {
    const { enabled, eventsEnabled, setLayer } = nextProps;
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
    if (!enabled && !isEqual(enabled, this.props.enabled)) {
      this.removeEvents();
    }
    if (enabled && !eventsEnabled) {
      this.setEvents();
    }
  }

  setEvents() {
    console.log('setEvents'); // eslint-disable-line
    const { updateLayer, setRecentImageryEventsEnabled } = this.props;
    const { map } = this.middleView;

    map.addListener('dragend', () => {
      updateLayer({
        middleView: this.middleView,
        latitude: map.getCenter().lng(),
        longitude: map.getCenter().lat(),
        start: '2016-01-01',
        end: '2016-09-01'
      });
    });
    map.addListener('click', e => {
      console.log(e); // eslint-disable-line
    });
    setRecentImageryEventsEnabled(true);
  }

  removeEvents() {
    const { setRecentImageryEventsEnabled } = this.props;
    const { map } = this.middleView;
    google.maps.event.clearListeners(map, 'dragend'); // eslint-disable-line
    google.maps.event.clearListeners(map, 'click'); // eslint-disable-line
    setRecentImageryEventsEnabled(false);
  }

  render() {
    return createElement(RecentImageryComponent, {
      ...this.props
    });
  }
}

RecentImageryContainer.propTypes = {
  enabled: PropTypes.bool,
  eventsEnabled: PropTypes.bool,
  setLayer: PropTypes.func,
  updateLayer: PropTypes.func,
  setRecentImageryEventsEnabled: PropTypes.func
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(RecentImageryContainer);
