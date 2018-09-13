import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import satelliteIcon from 'assets/icons/satellite.svg';
import Button from 'components/ui/button';
import RecentImagerySettings from './components/recent-imagery-settings';

import './recent-imagery-styles.scss';

class RecentImagery extends PureComponent {
  render() {
    const {
      active,
      showSettings,
      isTimelineOpen,
      tile,
      allTiles,
      settings,
      canDrop,
      connectDropTarget,
      toggleRecentImagery,
      setRecentImagerySettings,
      setRecentImageryShowSettings
    } = this.props;

    return connectDropTarget(
      <div
        className={`c-recent-imagery ${
          canDrop ? 'c-recent-imagery--dragging' : ''
        }`}
      >
        <Button
          className={`c-recent-imagery__button ${
            isTimelineOpen ? 'c-recent-imagery__button--timeline-open' : ''
          }`}
          theme="theme-button-map-control"
          active={active}
          onClick={() => toggleRecentImagery()}
        >
          <Icon icon={satelliteIcon} className="satellite-icon" />
          <span>
            Recent<br />Imagery
          </span>
        </Button>
        {showSettings && (
          <RecentImagerySettings
            selectedTile={tile}
            tiles={allTiles}
            settings={settings}
            setRecentImagerySettings={setRecentImagerySettings}
            setRecentImageryShowSettings={setRecentImageryShowSettings}
          />
        )}
      </div>
    );
  }
}

RecentImagery.propTypes = {
  active: PropTypes.bool.isRequired,
  showSettings: PropTypes.bool.isRequired,
  isTimelineOpen: PropTypes.bool.isRequired,
  tile: PropTypes.object,
  allTiles: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  canDrop: PropTypes.bool.isRequired,
  toggleRecentImagery: PropTypes.func.isRequired,
  setRecentImagerySettings: PropTypes.func.isRequired,
  setRecentImageryShowSettings: PropTypes.func.isRequired
};

export default RecentImagery;
