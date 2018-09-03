/* eslint-disable no-undef */

import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { checkLocationInsideBbox } from 'utils/geoms';

import withTooltipEvent from 'components/ui/with-tooltip-evt';
import * as mapActions from 'components/map-v2/actions';

import Component from './recent-imagery-component';
import ownActions from './recent-imagery-actions';
import reducers, { initialState } from './recent-imagery-reducers';
import { getProps } from './recent-imagery-selectors';

const actions = {
  ...ownActions,
  ...mapActions
};

const mapStateToProps = ({ recentImagery, location, datasets }) =>
  ({ ...getProps({ ...recentImagery, query: location.query, datasets: datasets.datasets }) });

class RecentImageryContainer extends PureComponent {
  componentDidMount() {
    const {
      dates,
      settings,
      position,
      getData
    } = this.props;
    getData({
      ...position,
      ...settings,
      start: dates.start,
      end: dates.end,
      bands: settings.bands
    });
  }

  componentDidUpdate(prevProps) {
    const {
      active,
      dataStatus,
      tile,
      bounds,
      sources,
      dates,
      settings,
      getData,
      getMoreTiles,
      position,
      datasets,
      setMapSettings
    } = this.props;
    console.log(tile);
    const isNewTile =
      tile && (!prevProps.tile || tile.url !== prevProps.tile.url);
    const positionInsideTile = bounds ? checkLocationInsideBbox([position.lat, position.lng], bounds) : true;

    const activeDatasets = datasets && !!datasets.length ? datasets.filter(d => !d.isRecentImagery) : [];
    // if (isNewTile && active && tile && (tile.url !== (prevProps.tile && prevProps.tile.url))) {
    //   const recentDataset = {
    //     dataset: '3668bb78-d77e-4215-bc2a-07433e204823',
    //     layers: ['babd9968-4b55-4bc5-b771-d471ef8fbd8c'],
    //     visibility: 1,
    //     opacity: 1,
    //     isRecentImagery: true,
    //     params: {
    //       url: tile.url
    //     }
    //   };
    //   setMapSettings({
    //     datasets: activeDatasets.concat(recentDataset)
    //   });
    // }

    // if (!active) {
    //   setMapSettings({
    //     datasets: activeDatasets || []
    //   });
    // }

    if (
      (active && active !== prevProps.active) ||
      !positionInsideTile ||
      !isEqual(settings.date, prevProps.settings.date) ||
      !isEqual(settings.weeks, prevProps.settings.weeks) ||
      !isEqual(settings.bands, prevProps.settings.bands)
    ) {
      getData({
        ...position,
        start: dates.start,
        end: dates.end,
        bands: settings.bands
      });
    }
    if (!active && active !== prevProps.active) {
      this.removeTile();
      // this.removeBoundsPolygon();
    }
    if (isNewTile) {
      if (this.activatedFromUrl && !prevProps.tile) {
        this.updateTile(tile.url);
      } else if (!prevProps.tile) {
        this.showTile(tile.url);
      } else {
        this.updateTile(tile.url);
      }
      // this.addBoundsPolygon(bounds, tile);
    }
    if (
      !dataStatus.haveAllData &&
      (dataStatus.requestedTiles !== prevProps.dataStatus.requestedTiles ||
        dataStatus.requestFails !== prevProps.dataStatus.requestFails ||
        isNewTile)
    ) {
      getMoreTiles({ sources, dataStatus, bands: settings.bands });
    }
  }

  showTile() {

  }

  updateTile() {

  }

  removeTile() {
    const { resetData } = this.props;
    resetData();
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

RecentImageryContainer.propTypes = {
  position: PropTypes.object,
  active: PropTypes.bool,
  dataStatus: PropTypes.object,
  tile: PropTypes.object,
  bounds: PropTypes.array,
  sources: PropTypes.array,
  dates: PropTypes.object,
  settings: PropTypes.object,
  getData: PropTypes.func,
  getMoreTiles: PropTypes.func,
  resetData: PropTypes.func
};

export { actions, reducers, initialState };
export default withTooltipEvent(
  connect(mapStateToProps, actions)(RecentImageryContainer)
);
