import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { cancelToken } from 'utils/request';
import reducerRegistry from 'redux/registry';

import { setMapSettings } from 'components/map/actions';
import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import { getRecentImageryProps } from './selectors';

const actions = {
  ...ownActions,
  setMapSettings,
};

const mapStateToProps = getRecentImageryProps;

class RecentImageryContainer extends PureComponent {
  componentDidMount = () => {
    const { active, position, dates, settings, getRecentImageryData } =
      this.props;

    if (this.getDataSource) {
      this.getDataSource.cancel();
    }

    this.getDataSource = cancelToken();
    if (active) {
      getRecentImageryData({
        ...position,
        start: dates.start,
        end: dates.end,
        bands: settings.bands,
        token: this.getDataSource.token,
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    const {
      active,
      dataStatus,
      activeTile,
      sources,
      settings,
      zoom,
      center,
      getMoreTiles,
      loadingMoreTiles,
      resetRecentImageryData,
    } = this.props;

    const isNewTile =
      activeTile &&
      !!activeTile.url &&
      (!prevProps.activeTile || activeTile.url !== prevProps.activeTile.url);

    const modifiedTileSettings =
      !isEqual(settings.date, prevProps.settings.date) ||
      !isEqual(settings.weeks, prevProps.settings.weeks) ||
      !isEqual(settings.bands, prevProps.settings.bands);

    const modifiedMapPosition =
      !isEqual(prevProps.zoom, zoom) || !isEqual(prevProps.center, center);

    if (modifiedTileSettings || modifiedMapPosition) {
      this.handleUpdateTiles(prevProps);
    }

    // if new tile update on map
    if (active && isNewTile) {
      this.setTile();
    }

    if (!active && active !== prevProps.active) {
      this.removeTile();
      resetRecentImageryData();
    }

    // get the rest of the tiles
    if (
      dataStatus &&
      !dataStatus.haveAllData &&
      !loadingMoreTiles &&
      active &&
      activeTile
    ) {
      getMoreTiles({
        sources,
        dataStatus,
        bands: settings.bands,
      });
    }
  };

  handleUpdateTiles = debounce(() => {
    const { active, dates, settings, getRecentImageryData, position } =
      this.props;
    // get data if activated or new props
    if (this.getDataSource) {
      this.getDataSource.cancel(
        'Cancelling duplicate fetch for recent imagery'
      );
    }

    if (!active) return;

    this.getDataSource = cancelToken();
    getRecentImageryData({
      ...position,
      start: dates.start,
      end: dates.end,
      bands: settings.bands,
      token: this.getDataSource.token,
    });
  }, 4000);

  setTile = debounce(() => {
    const { datasets, activeTile, recentImageryDataset } = this.props;
    if (recentImageryDataset && activeTile && activeTile.url) {
      const activeDatasets =
        datasets &&
        !!datasets.length &&
        datasets.filter((d) => !d.isRecentImagery);
      const recentDataset = {
        dataset: recentImageryDataset.dataset,
        layers: [recentImageryDataset.layer],
        visibility: true,
        opacity: 1,
        isRecentImagery: true,
        params: {
          url: activeTile.url,
        },
      };
      this.props.setMapSettings({
        datasets: activeDatasets
          ? activeDatasets.concat(recentDataset)
          : [recentDataset],
      });
    }
  }, 200);

  removeTile() {
    const { datasets, setRecentImagerySettings } = this.props;
    const activeDatasets =
      datasets &&
      !!datasets.length &&
      datasets.filter((d) => !d.isRecentImagery);
    this.props.setMapSettings({
      datasets: activeDatasets || [],
    });
    setRecentImagerySettings({
      selectedIndex: 0,
      selected: null,
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
  sources: PropTypes.array,
  dates: PropTypes.object,
  settings: PropTypes.object,
  getRecentImageryData: PropTypes.func,
  getMoreTiles: PropTypes.func,
  datasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  recentImageryDataset: PropTypes.object,
  resetRecentImageryData: PropTypes.func,
  setRecentImagerySettings: PropTypes.func,
  zoom: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  center: PropTypes.object,
  // error: PropTypes.bool,
};

reducerRegistry.registerModule('recentImagery', {
  actions: ownActions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(RecentImageryContainer);
