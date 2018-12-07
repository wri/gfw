import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { checkLocationInsideBbox } from 'utils/geoms';
import { CancelToken } from 'axios';

import { setMapSettings } from 'components/maps/map/actions';
import * as ownActions from './recent-imagery-actions';
import reducers, { initialState } from './recent-imagery-reducers';
import { getRecentImageryProps } from './recent-imagery-selectors';

const actions = {
  ...ownActions,
  setMapSettings
};

const mapStateToProps = getRecentImageryProps;

class RecentImageryContainer extends PureComponent {
  componentDidMount = () => {
    const {
      active,
      position,
      dates,
      settings,
      getRecentImageryData
    } = this.props;
    if (this.getDataSource) {
      this.getDataSource.cancel();
    }
    this.getDataSource = CancelToken.source();
    if (active) {
      getRecentImageryData({
        ...position,
        start: dates.start,
        end: dates.end,
        bands: settings.bands,
        token: this.getDataSource.token
      });
    }
  };

  componentDidUpdate = prevProps => {
    const {
      active,
      dataStatus,
      activeTile,
      bounds,
      sources,
      dates,
      settings,
      getRecentImageryData,
      getMoreTiles,
      position,
      loadingMoreTiles,
      resetRecentImageryData
    } = this.props;

    const isNewTile =
      activeTile &&
      !!activeTile.url &&
      (!prevProps.activeTile || activeTile.url !== prevProps.activeTile.url);
    const positionInsideTile = bounds
      ? checkLocationInsideBbox([position.lat, position.lng], bounds)
      : true;

    // get data if activated or new props
    if (
      active &&
      (active !== prevProps.active ||
        !positionInsideTile ||
        !isEqual(settings.date, prevProps.settings.date) ||
        !isEqual(settings.weeks, prevProps.settings.weeks) ||
        !isEqual(settings.bands, prevProps.settings.bands))
    ) {
      if (this.getDataSource) {
        this.getDataSource.cancel();
      }
      this.getDataSource = CancelToken.source();
      getRecentImageryData({
        ...position,
        start: dates.start,
        end: dates.end,
        bands: settings.bands
      });
    }
    // get the rest of the tiles
    if (!dataStatus.haveAllData && !loadingMoreTiles && active) {
      getMoreTiles({
        sources,
        dataStatus,
        bands: settings.bands
      });
    }

    // if new tile update on map
    if (active && isNewTile) {
      this.setTile();
    }

    if (!active && active !== prevProps.active) {
      this.removeTile();
      resetRecentImageryData();
    }
  };

  setTile = debounce(() => {
    const { datasets, activeTile, recentImageryDataset } = this.props;
    if (recentImageryDataset && activeTile && activeTile.url) {
      const activeDatasets =
        datasets &&
        !!datasets.length &&
        datasets.filter(d => !d.isRecentImagery);
      const recentDataset = {
        dataset: recentImageryDataset.dataset,
        layers: [recentImageryDataset.layer],
        visibility: 1,
        opacity: 1,
        isRecentImagery: true,
        params: {
          url: activeTile.url
        }
      };
      this.props.setMapSettings({
        datasets: activeDatasets
          ? activeDatasets.concat(recentDataset)
          : [recentDataset]
      });
    }
  }, 200);

  removeTile() {
    const { datasets, setRecentImagerySettings } = this.props;
    const activeDatasets =
      datasets && !!datasets.length && datasets.filter(d => !d.isRecentImagery);
    this.props.setMapSettings({
      datasets: activeDatasets || []
    });
    setRecentImagerySettings({
      selectedIndex: 0,
      selected: null
    });
  }

  render() {
    return null;
  }
}

RecentImageryContainer.propTypes = {
  position: PropTypes.object,
  loadingMoreTiles: PropTypes.bool,
  active: PropTypes.bool,
  dataStatus: PropTypes.object,
  activeTile: PropTypes.object,
  bounds: PropTypes.array,
  sources: PropTypes.array,
  dates: PropTypes.object,
  settings: PropTypes.object,
  getRecentImageryData: PropTypes.func,
  getMoreTiles: PropTypes.func,
  datasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  recentImageryDataset: PropTypes.object,
  resetRecentImageryData: PropTypes.func,
  setRecentImagerySettings: PropTypes.func
};

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(RecentImageryContainer);
