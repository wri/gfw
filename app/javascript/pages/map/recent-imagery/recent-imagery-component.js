import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/button';
import RecentImagerySettings from './components/recent-imagery-settings';

import './recent-imagery-styles.scss';

class RecentImagery extends PureComponent {
  render() {
    const {
      showSettings,
      settings,
      canDrop,
      connectDropTarget,
      toogleRecentImagery
    } = this.props;

    return connectDropTarget(
      <div
        className={`c-recent-imagery ${
          canDrop ? 'c-recent-imagery--dragging' : ''
        }`}
      >
        <Button
          className="c-recent-imagery__button"
          onClick={() => toogleRecentImagery()}
        >
          Recent Imagery
        </Button>
        {showSettings && <RecentImagerySettings settings={settings} />}
      </div>
    );
  }
}

RecentImagery.propTypes = {
  showSettings: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  canDrop: PropTypes.bool.isRequired,
  toogleRecentImagery: PropTypes.func.isRequired
};

export default RecentImagery;
