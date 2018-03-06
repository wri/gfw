import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { getPolygonCenter } from 'utils/map';

import actions from './recent-imagery-actions';
import reducers, { initialState } from './recent-imagery-reducers';
import { getDates } from './recent-imagery-selectors';
import RecentImageryComponent from './recent-imagery-component';

const LAYER_SLUG = 'sentinel_tiles';

const mapStateToProps = ({ recentImagery }) => {
  const { activated, data } = recentImagery;
  return {
    activated,
    data,
    dates: getDates()
  };
};

class RecentImageryContainer extends PureComponent {
  componentDidMount() {
    this.middleView = window.App.Views.ReactMapMiddleView;
    this.boundsPolygon = null;
    this.boundsPolygonInfowindow = null;
    this.activatedFromUrl = false;
    window.addEventListener('isRecentImageryActivated', () => {
      const { activated, toogleRecentImagery } = this.props;
      if (!activated) {
        this.activatedFromUrl = true;
        toogleRecentImagery();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { activated, data, dates, getTiles } = nextProps;
    const { map } = this.middleView;
    if (activated && activated !== this.props.activated) {
      getTiles({
        latitude: map.getCenter().lng(),
        longitude: map.getCenter().lat(),
        start: dates.start,
        end: dates.end
      });
    }
    if (!activated && activated !== this.props.activated) {
      this.removeLayer();
      this.removeEvents();
      this.removeBoundsPolygon();
    }
    if (data.url !== '' && !isEqual(data, this.props.data)) {
      if (this.activatedFromUrl && this.props.data.url === '') {
        this.updateLayer(data.url);
        this.setEvents();
      } else if (this.props.data.url === '') {
        this.showLayer(data.url);
        this.setEvents();
      } else {
        this.updateLayer(data.url);
      }
      this.addBoundsPolygon(data);
    }
  }

  setEvents() {
    const { dates, getTiles } = this.props;
    const { map } = this.middleView;

    const loadNewTile = () => {
      const needNewTile = !google.maps.geometry.poly.containsLocation( // eslint-disable-line
        map.getCenter(),
        this.boundsPolygon
      );
      if (needNewTile) {
        getTiles({
          latitude: map.getCenter().lng(),
          longitude: map.getCenter().lat(),
          start: dates.start,
          end: dates.end
        });
      }
    };
    map.addListener('dragend', loadNewTile);
    map.addListener('zoom_changed', loadNewTile);
  }

  removeEvents() {
    const { map } = this.middleView;
    google.maps.event.clearListeners(map, 'dragend'); // eslint-disable-line
    google.maps.event.clearListeners(map, 'zoom_changed'); // eslint-disable-line
  }

  showLayer(url) {
    this.middleView.toggleLayer(LAYER_SLUG, {
      urlTemplate: url
    });
  }

  removeLayer() {
    const { setRecentImageryData } = this.props;
    this.middleView.toggleLayer(LAYER_SLUG);
    this.activatedFromUrl = false;
    setRecentImageryData({
      url: ''
    });
  }

  updateLayer(url) {
    this.middleView.updateLayer(LAYER_SLUG, {
      urlTemplate: url
    });
  }

  addBoundsPolygon(data) {
    const { map } = this.middleView;
    const { bounds, cloudScore, dateTime, instrument } = data;

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
    const polygonCenter = getPolygonCenter(this.boundsPolygon);

    this.addBoundsPolygonEvents();
    this.boundsPolygon.setMap(map);

    if (this.boundsPolygonInfowindow !== null) {
      this.boundsPolygonInfowindow.close();
    }
    this.boundsPolygonInfowindow = new google.maps.InfoWindow({ // eslint-disable-line
      content: `<div class="recent-imagery-infowindow">
        ${moment(dateTime)
    .format('DD MMM YYYY')
    .toUpperCase()} - ${cloudScore}% cloud coverage - ${instrument}
      </div>`,
      position: polygonCenter.top
    });
  }

  addBoundsPolygonEvents() {
    const { map } = this.middleView;
    let clickTimeout = null;

    google.maps.event.addListener(this.boundsPolygon, 'mouseover', () => { // eslint-disable-line
      this.boundsPolygon.setOptions({
        fillColor: '#000000',
        fillOpacity: 0.1,
        strokeColor: '#000000',
        strokeOpacity: 0.5,
        strokeWeight: 1
      });
      this.boundsPolygonInfowindow.open(map);
    });
    google.maps.event.addListener(this.boundsPolygon, 'mouseout', () => { // eslint-disable-line
      this.boundsPolygon.setOptions({
        fillColor: 'transparent',
        strokeWeight: 0
      });
      this.boundsPolygonInfowindow.close();
    });
    google.maps.event.addListener(this.boundsPolygon, 'click', e => { // eslint-disable-line
      clickTimeout = setTimeout(() => {
        console.log(e); // eslint-disable-line
      }, 200);
    });
    google.maps.event.addListener(this.boundsPolygon, 'dblclick', () => { // eslint-disable-line
      clearTimeout(clickTimeout);
    });
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
  activated: PropTypes.bool,
  data: PropTypes.object,
  dates: PropTypes.object,
  toogleRecentImagery: PropTypes.func,
  setRecentImageryData: PropTypes.func,
  getTiles: PropTypes.func
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(RecentImageryContainer);
