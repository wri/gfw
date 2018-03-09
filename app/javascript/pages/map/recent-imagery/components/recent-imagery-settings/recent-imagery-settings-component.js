import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Slider from 'components/slider';
import RecentImageryThumbnail from 'pages/map/recent-imagery/components/recent-imagery-thumbnail';

import draggerIcon from 'assets/icons/dragger.svg';
import RecentImageryDrag from './recent-imagery-settings-drag';
import './recent-imagery-settings-styles.scss';

class RecentImagerySettings extends PureComponent {
  render() {
    const {
      selectedTile,
      tiles,
      settings,
      isDragging,
      connectDragSource,
      setRecentImagerySettings
    } = this.props;
    let opacity = 1;

    if (isDragging) {
      opacity = 0;
    }

    return connectDragSource(
      <div
        className="c-recent-imagery-settings"
        style={{ ...settings.styles, opacity }}
      >
        <Icon icon={draggerIcon} className="dragger-icon" />
        <div className="c-recent-imagery-settings__title">
          RECENT HI-RES SATELLITE IMAGERY
        </div>
        <div className="c-recent-imagery-settings__thumbnails">
          <div className="c-recent-imagery-settings__thumbnails__description">
            {selectedTile.description}
          </div>
          <Slider
            settings={{
              dots: false,
              slidesToShow: 5
            }}
          >
            {tiles.length &&
              tiles.map((tile, i) => (
                <div key={`recent-imagery-thumb-${tile.id}`}>
                  <RecentImageryThumbnail
                    id={i}
                    tile={tile}
                    selected={settings.selectedTileIndex === i}
                    handleClick={() => {
                      setRecentImagerySettings({ selectedTileIndex: i });
                    }}
                  />
                </div>
              ))}
          </Slider>
        </div>
      </div>
    );
  }
}

RecentImagerySettings.propTypes = {
  selectedTile: PropTypes.object.isRequired,
  tiles: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  setRecentImagerySettings: PropTypes.func.isRequired
};

export default RecentImageryDrag(RecentImagerySettings);
