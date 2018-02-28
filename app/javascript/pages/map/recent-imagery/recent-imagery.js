import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './recent-imagery-actions';
import reducers, { initialState } from './recent-imagery-reducers';
import RecentImageryComponent from './recent-imagery-component';

const mapStateToProps = ({ recentImagery }) => {
  const { enabled, data } = recentImagery;
  return {
    enabled,
    data
  };
};

class RecentImageryContainer extends PureComponent {
  componentDidMount() {
    this.middleView = window.App.Views.ReactMapMiddleView;
    this.boundsPolygon = null;
  }

  componentWillReceiveProps(nextProps) {
    const { enabled, data, getTiles } = nextProps;
    const { map } = this.middleView;
    if (enabled && enabled !== this.props.enabled) {
      getTiles({
        latitude: map.getCenter().lng(),
        longitude: map.getCenter().lat(),
        start: '2016-01-01',
        end: '2016-09-01'
      });
    }
    if (!enabled && enabled !== this.props.enabled) {
      this.removeEvents();
      this.removeBoundsPolygon();
    }
    if (!isEqual(data, this.props.data)) {
      if (this.props.data.url === '') {
        this.showLayer(data.url);
        this.setEvents();
      } else {
        this.updateLayer(data.url);
      }
      this.addBoundsPolygon(data.bounds);
    }
  }

  setEvents() {
    const { getTiles } = this.props;
    const { map } = this.middleView;
    map.addListener('dragend', () => {
      const needNewTile = !google.maps.geometry.poly.containsLocation(
        // eslint-disable-line
        map.getCenter(),
        this.boundsPolygon
      );
      if (needNewTile) {
        getTiles({
          latitude: map.getCenter().lng(),
          longitude: map.getCenter().lat(),
          start: '2016-01-01',
          end: '2016-09-01'
        });
      }
    });
  }

  removeEvents() {
    const { map } = this.middleView;
    google.maps.event.clearListeners(map, 'dragend'); // eslint-disable-line
  }

  showLayer(url) {
    this.middleView.toggleLayer('sentinel_tiles', {
      urlTemplate: url
    });
  }

  updateLayer(url) {
    this.middleView.updateLayer('sentinel_tiles', {
      urlTemplate: url
    });
  }

  addBoundsPolygon(bounds) {
    const { map } = this.middleView;
    let clickTimeout = null;

    if (this.boundsPolygon !== null) {
      this.removeBoundsPolygon();
    }
    const coords = [];
    bounds.forEach(item => {
      coords.push({
        lat: item[1],
        lng: item[0]
      });
    });
    this.boundsPolygon = new google.maps.Polygon({ // eslint-disable-line
      paths: coords,
      fillColor: 'transparent',
      strokeWeight: 0
    });
    google.maps.event.addListener(this.boundsPolygon, 'mouseover', function () { // eslint-disable-line
      this.setOptions({
        fillColor: '#000000',
        fillOpacity: 0.1,
        strokeColor: '#000000',
        strokeOpacity: 0.5,
        strokeWeight: 1
      });
    });
    google.maps.event.addListener(this.boundsPolygon, 'mouseout', function () { // eslint-disable-line
      this.setOptions({
        fillColor: 'transparent',
        strokeWeight: 0
      });
    });
    google.maps.event.addListener(this.boundsPolygon, 'click', (e) => { // eslint-disable-line
      clickTimeout = setTimeout(() => {
        console.log(e); // eslint-disable-line
      }, 200);
    });
    google.maps.event.addListener(this.boundsPolygon, 'dblclick', (e) => { // eslint-disable-line
      clearTimeout(clickTimeout);
    });
    this.boundsPolygon.setMap(map);
  }

  removeBoundsPolygon() {
    this.boundsPolygon.setMap(null);
  }

  render() {
    return createElement(RecentImageryComponent, {
      ...this.props
    });
  }
}

RecentImageryContainer.propTypes = {
  enabled: PropTypes.bool,
  data: PropTypes.object,
  getTiles: PropTypes.func
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(RecentImageryContainer);
