/* eslint-disable no-undef */

import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from './recent-imagery-actions';
import reducers, { initialState } from './recent-imagery-reducers';
import {
  getAllTiles,
  getTile,
  getBounds,
  getSources,
  getDates
} from './recent-imagery-selectors';
import RecentImageryComponent from './recent-imagery-component';
import withTooltipEvent from 'components/ui/with-tooltip-evt';

const mapStateToProps = ({ recentImagery }) => {
  const {
    active,
    visible,
    showSettings,
    isTimelineOpen,
    data,
    dataStatus,
    settings
  } = recentImagery;
  const selectorData = {
    data: data.tiles,
    dataStatus,
    settings
  };
  return {
    active,
    visible,
    showSettings,
    isTimelineOpen,
    dataStatus,
    allTiles: getAllTiles(selectorData),
    tile: getTile(selectorData),
    bounds: getBounds(selectorData),
    sources: getSources(selectorData),
    dates: getDates(selectorData),
    settings
  };
};

class RecentImageryContainer extends PureComponent {
  componentDidMount() {
    this.boundsPolygon = null;
    this.boundsPolygonInfowindow = null;
    this.activatedFromUrl = false;
    this.removedFromUrl = false;
  }

  componentWillReceiveProps() {
    // const {
    //   active,
    //   showSettings,
    //   dataStatus,
    //   tile,
    //   bounds,
    //   sources,
    //   dates,
    //   settings,
    //   getData,
    //   getMoreTiles
    // } = nextProps;
    // const isNewTile =
    //   tile && (!this.props.tile || tile.url !== this.props.tile.url);
    //
    // if (
    //   (active && active !== this.props.active) ||
    //   !isEqual(settings.date, this.props.settings.date) ||
    //   !isEqual(settings.weeks, this.props.settings.weeks) ||
    //   !isEqual(settings.bands, this.props.settings.bands)
    // ) {
    //   // TODO: add lat lng
    //   getData({
    //     latitude: 0,
    //     longitude: 0,
    //     start: dates.start,
    //     end: dates.end,
    //     bands: settings.bands
    //   });
    // }
    // if (!active && active !== this.props.active) {
    //   this.removeLayer();
    //   this.removeEvents();
    //   this.removeBoundsPolygon();
    // }
    // if (isNewTile) {
    //   if (this.activatedFromUrl && !this.props.tile) {
    //     this.updateLayer(tile.url);
    //     this.setEvents();
    //   } else if (!this.props.tile) {
    //     this.showLayer(tile.url);
    //     this.setEvents();
    //   } else {
    //     this.updateLayer(tile.url);
    //   }
    //   this.addBoundsPolygon(bounds, tile);
    // }
    // if (
    //   !dataStatus.haveAllData &&
    //   showSettings &&
    //   (showSettings !== this.props.showSettings ||
    //     dataStatus.requestedTiles !== this.props.dataStatus.requestedTiles ||
    //     dataStatus.requestFails !== this.props.dataStatus.requestFails ||
    //     isNewTile)
    // ) {
    //   getMoreTiles({ sources, dataStatus, bands: settings.bands });
    // }
  }

  setEvents() {
    // TODO: event handler that checks if current tile contains map coordinates, if not request new tile.
    const needNewTile = false;
    if (needNewTile) {
      getData({
        latitude: 0,
        longitude: 0,
        start: dates.start,
        end: dates.end,
        bands: settings.bands
      });
    }
  }

  removeLayer() {
    const { resetData } = this.props;
    resetData();
  }

  addBoundsPolygon(bounds, tile) {}

  removeBoundsPolygon() {}

  render() {
    return createElement(RecentImageryComponent, {
      ...this.props
    });
  }
}

RecentImageryContainer.propTypes = {
  active: PropTypes.bool,
  visible: PropTypes.bool,
  showSettings: PropTypes.bool,
  dataStatus: PropTypes.object,
  tile: PropTypes.object,
  bounds: PropTypes.array,
  sources: PropTypes.array,
  dates: PropTypes.object,
  settings: PropTypes.object,
  toogleRecentImagery: PropTypes.func,
  setVisible: PropTypes.func,
  setTimelineFlag: PropTypes.func,
  setRecentImageryShowSettings: PropTypes.func,
  getData: PropTypes.func,
  getMoreTiles: PropTypes.func,
  resetData: PropTypes.func
};

export { actions, reducers, initialState };
export default withTooltipEvent(
  connect(mapStateToProps, actions)(RecentImageryContainer)
);
