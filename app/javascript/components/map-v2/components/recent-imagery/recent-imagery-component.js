import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import RecentImagerySettings from './components/recent-imagery-settings';

import './recent-imagery-styles.scss';

class RecentImagery extends PureComponent {
  render() {
    const {
      tile,
      allTiles,
      settings,
      setRecentImagerySettings,
      setRecentImageryShowSettings,
      onClose,
      getTooltipContentProps,
      setMapSettings,
      datasets
    } = this.props;

    return (
      <RecentImagerySettings
        selectedTile={tile}
        tiles={allTiles}
        settings={settings}
        setRecentImagerySettings={setRecentImagerySettings}
        setRecentImageryShowSettings={setRecentImageryShowSettings}
        onClose={onClose}
        getTooltipContentProps={getTooltipContentProps}
        setMapSettings={setMapSettings}
        datasets={datasets}
      />
    );
  }
}

RecentImagery.propTypes = {
  tile: PropTypes.object,
  allTiles: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setRecentImagerySettings: PropTypes.func.isRequired,
  setRecentImageryShowSettings: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  getTooltipContentProps: PropTypes.func.isRequired
};

export default RecentImagery;
