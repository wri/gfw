import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { checkLocationInsideBbox } from 'utils/geoms';

import * as mapActions from 'components/map-v2/actions';
import ownActions from './recent-imagery-actions';

import reducers, { initialState } from './recent-imagery-reducers';
import { getRecentImageryProps } from './recent-imagery-selectors';

const actions = {
  ...ownActions,
  ...mapActions
};

const mapStateToProps = getRecentImageryProps;

class RecentImageryContainer extends PureComponent {
  componentDidMount() {
    const { dates, settings, position, getData } = this.props;

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
      activeTile,
      bounds,
      sources,
      dates,
      settings,
      getData,
      getMoreTiles,
      position
    } = this.props;
    const isNewTile =
    activeTile && activeTile.url &&
    (!prevProps.activeTile || activeTile.url !== prevProps.activeTile.url);
    const positionInsideTile = bounds
      ? checkLocationInsideBbox([position.lat, position.lng], bounds)
      : true;

    console.log(isNewTile, activeTile);
    if (active && isNewTile) {
      this.setTile();
    }

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
    if (!dataStatus.haveAllData &&
      ((active && active !== prevProps.active) ||
        (dataStatus.requestedTiles !== prevProps.dataStatus.requestedTiles) ||
        (dataStatus.requestFails !== prevProps.dataStatus.requestFails) ||
        isNewTile)
    ) {
      getMoreTiles({ sources, dataStatus, bands: settings.bands });
    }
  }

  componentWillUnmount() {
    this.removeTile();
  }

  setTile() {
    const {
      datasets,
      activeTile,
      setMapSettings,
      recentImageryDataset
    } = this.props;
    if (recentImageryDataset && activeTile.url) {
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
      setMapSettings({
        datasets: activeDatasets
          ? activeDatasets.concat(recentDataset)
          : [recentDataset]
      });
    }
  }

  removeTile() {
    const { datasets, setMapSettings, setRecentImagerySettings } = this.props;
    const activeDatasets =
      datasets && !!datasets.length && datasets.filter(d => !d.isRecentImagery);
    setMapSettings({
      datasets: activeDatasets || []
    });
    setRecentImagerySettings({
      selected: ''
    });
  }

  render() {
    console.log('location', this.props.location);
    return null;
  }
}

RecentImageryContainer.propTypes = {
  position: PropTypes.object,
  active: PropTypes.bool,
  dataStatus: PropTypes.object,
  activeTile: PropTypes.object,
  bounds: PropTypes.array,
  sources: PropTypes.array,
  dates: PropTypes.object,
  settings: PropTypes.object,
  getData: PropTypes.func,
  getMoreTiles: PropTypes.func,
  datasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  recentImageryDataset: PropTypes.object,
  resetRecentImagery: PropTypes.func
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(RecentImageryContainer);
