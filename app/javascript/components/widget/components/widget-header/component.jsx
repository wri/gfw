import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import WidgetMapButton from './components/widget-map-button';
import WidgetSettingsButton from './components/widget-settings-button';
import WidgetInfoButton from './components/widget-info-button';
import WidgetShareButton from './components/widget-share-button';

import './styles.scss';

class WidgetHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    embed: PropTypes.bool,
    simple: PropTypes.bool,
    active: PropTypes.string,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleShowMap: PropTypes.func,
    handleShowShare: PropTypes.func,
    loading: PropTypes.bool,
    settingsOptions: PropTypes.array
  };

  render() {
    const {
      active,
      handleShowMap,
      title,
      loading,
      settingsOptions,
      embed,
      config: { large, datasets },
      simple,
      handleShowInfo,
      handleChangeSettings,
      handleShowShare
    } = this.props;

    return (
      <div className={cx('c-widget-header', { simple })}>
        <div className="title">{title}</div>
        <div className="options">
          {!embed &&
            !simple &&
            datasets &&
            <WidgetMapButton
              active={active}
              large={large}
              handleShowMap={handleShowMap}
            />
          }
          {!embed &&
            !simple &&
            !isEmpty(settingsOptions) &&
            <WidgetSettingsButton
              settings={settingsOptions}
              loading={loading}
              handleChangeSettings={handleChangeSettings}
              handleShowInfo={handleShowInfo}
            />
          }
          <div className="small-options">
            <WidgetInfoButton
              square={simple}
              handleOpenInfo={handleShowInfo}
            />
            {!simple &&
              <WidgetShareButton
                handleShowShare={handleShowShare}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetHeader;
