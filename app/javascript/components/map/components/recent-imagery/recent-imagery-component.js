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
      setRecentImageryShowSettings
    } = this.props;

    return (
      <div className="c-recent-imagery">
        <RecentImagerySettings
          selectedTile={tile}
          tiles={allTiles}
          settings={settings}
          setRecentImagerySettings={setRecentImagerySettings}
          setRecentImageryShowSettings={setRecentImageryShowSettings}
        />
      </div>
    );
  }
}

RecentImagery.propTypes = {
  showSettings: PropTypes.bool.isRequired,
  tile: PropTypes.object,
  allTiles: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setRecentImagerySettings: PropTypes.func.isRequired,
  setRecentImageryShowSettings: PropTypes.func.isRequired
};

export default RecentImagery;
