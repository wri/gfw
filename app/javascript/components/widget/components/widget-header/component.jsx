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
    large: PropTypes.bool,
    datasets: PropTypes.array,
    loading: PropTypes.bool,
    embed: PropTypes.bool,
    simple: PropTypes.bool,
    active: PropTypes.string,
    metaKey: PropTypes.string,
    options: PropTypes.array,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleShowMap: PropTypes.func,
    handleShowShare: PropTypes.func
  };

  render() {
    const {
      title,
      loading,
      active,
      embed,
      large,
      datasets,
      simple,
      options,
      metaKey,
      handleShowMap,
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
            !isEmpty(options) &&
            <WidgetSettingsButton
              options={options}
              loading={loading}
              handleChangeSettings={handleChangeSettings}
              handleShowInfo={handleShowInfo}
            />
          }
          <div className="small-options">
            <WidgetInfoButton
              square={simple}
              handleOpenInfo={() => handleShowInfo(metaKey)}
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
