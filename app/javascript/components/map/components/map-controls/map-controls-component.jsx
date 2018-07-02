import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import Sticky from 'react-stickynode';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import shareIcon from 'assets/icons/share.svg';
import './map-controls-styles.scss';

class MapControls extends PureComponent {
  render() {
    const {
      setMapSettings,
      className,
      stickyOptions,
      setShareModal,
      share,
      settings
    } = this.props;
    return (
      <div className={`c-map-controls ${className || ''}`}>
        <Sticky enabled={false} {...stickyOptions}>
          <Button
            theme="theme-button-map-control"
            onClick={() => setMapSettings({ zoom: settings.zoom + 1 })}
            tooltip={{ text: 'Zoom in' }}
          >
            <Icon icon={plusIcon} className="plus-icon" />
          </Button>
          <Button
            theme="theme-button-map-control"
            onClick={() => setMapSettings({ zoom: settings.zoom - 1 })}
            tooltip={{ text: 'Zoom out' }}
          >
            <Icon icon={minusIcon} className="minus-icon" />
          </Button>
          {share && (
            <Button
              className="theme-button-map-control"
              onClick={() =>
                setShareModal({
                  title: 'Share this view',
                  shareUrl: window.location.href,
                  embedUrl: window.location.href,
                  embedSettings: {
                    width: 670,
                    height: 490
                  }
                })
              }
              tooltip={{ text: 'Share or embed this view' }}
            >
              <Icon icon={shareIcon} />
            </Button>
          )}
        </Sticky>
      </div>
    );
  }
}

MapControls.propTypes = {
  className: Proptypes.string,
  setMapSettings: Proptypes.func,
  stickyOptions: Proptypes.object,
  setShareModal: Proptypes.func,
  share: Proptypes.bool,
  settings: Proptypes.object
};

export default MapControls;
