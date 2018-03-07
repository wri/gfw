import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';

import draggerIcon from 'assets/icons/dragger.svg';
import RecentImageryDrag from './recent-imagery-settings-drag';
import './recent-imagery-settings-styles.scss';

class RecentImagerySettings extends PureComponent {
  render() {
    const { settings, isDragging, connectDragSource } = this.props;

    if (isDragging) {
      return null;
    }

    return connectDragSource(
      <div className="c-recent-imagery-settings" style={{ ...settings.styles }}>
        <Icon icon={draggerIcon} className="dragger-icon" />
        <div className="c-recent-imagery-settings__title">
          RECENT HI-RES SATELLITE IMAGERY
        </div>
      </div>
    );
  }
}

RecentImagerySettings.propTypes = {
  settings: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

export default RecentImageryDrag(RecentImagerySettings);
