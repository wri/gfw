import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import WidgetMapButton from './components/widget-map-button';
import WidgetSettingsButton from './components/widget-settings-button';
import WidgetInfoButton from './components/widget-info-button';
import WidgetShareButton from './components/widget-share-button';
import WidgetDownloadButton from './components/widget-download-button';

import './styles.scss';

class WidgetHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    widget: PropTypes.string,
    large: PropTypes.bool,
    datasets: PropTypes.array,
    loading: PropTypes.bool,
    embed: PropTypes.bool,
    simple: PropTypes.bool,
    active: PropTypes.bool,
    metaKey: PropTypes.string,
    settingsConfig: PropTypes.array,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleShowMap: PropTypes.func,
    handleShowShare: PropTypes.func,
    preventCloseSettings: PropTypes.bool,
    downloadLink: PropTypes.string
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
      settingsConfig,
      metaKey,
      handleShowMap,
      handleShowInfo,
      handleChangeSettings,
      handleShowShare,
      preventCloseSettings,
      widget,
      downloadLink
    } = this.props;

    const showSettingsBtn = !embed && !simple && !isEmpty(settingsConfig);
    const showDownloadBtn = !embed && !simple && downloadLink;
    const showMapBtn = !embed && !simple && datasets;
    const showSeparator = showSettingsBtn || showDownloadBtn || showMapBtn;

    return (
      <div className={cx('c-widget-header', { simple })}>
        <div className="title">{title}</div>
        <div className="options">
          {showMapBtn && (
            <WidgetMapButton
              active={active}
              large={large}
              handleShowMap={handleShowMap}
            />
          )}
          {showDownloadBtn && (
            <WidgetDownloadButton downloadLink={downloadLink} />
          )}
          {showSettingsBtn && (
            <WidgetSettingsButton
              settingsConfig={settingsConfig}
              loading={loading}
              widget={widget}
              handleChangeSettings={handleChangeSettings}
              handleShowInfo={handleShowInfo}
              preventCloseSettings={preventCloseSettings}
            />
          )}
          {showSeparator && <span className="separator" />}
          <div className="small-options">
            <WidgetInfoButton
              square={simple}
              handleOpenInfo={() => handleShowInfo(metaKey)}
            />
            {!simple && <WidgetShareButton handleShowShare={handleShowShare} />}
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetHeader;
