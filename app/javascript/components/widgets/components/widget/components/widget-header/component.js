import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { isParent } from 'utils/dom';
import cx from 'classnames';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { track } from 'app/analytics';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import settingsIcon from 'assets/icons/settings.svg';
import shareIcon from 'assets/icons/share.svg';
import infoIcon from 'assets/icons/info.svg';
import mapIcon from 'assets/icons/map-button.svg';
import downloadIcon from 'assets/icons/download.svg';

import WidgetSettings from './components/widget-settings';

import './styles.scss';

class WidgetHeader extends PureComponent {
  state = {
    tooltipOpen: false
  };

  renderMapButton = () => {
    const {
      widget,
      active,
      config,
      locationName,
      isDeviceTouch,
      setActiveWidget
    } = this.props;
    const isSmall = !config.large;

    return (
      <Button
        className={cx('map-button', { '-active': active })}
        theme={cx(
          'theme-button-small',
          { small: isSmall },
          { square: isDeviceTouch || isSmall }
        )}
        tooltip={{ text: active ? 'Currently displayed' : 'Show on map' }}
        onClick={() => {
          setActiveWidget(widget);
          track('viewWidgetOnMap', {
            label: `${widget} in ${locationName || ''}`
          });
        }}
      >
        {isSmall || isDeviceTouch ? (
          <Icon icon={mapIcon} className="map-icon" />
        ) : (
          'SHOW ON MAP'
        )}
      </Button>
    );
  };

  renderSettingsButton = () => {
    const {
      modalClosing,
      locationName,
      title,
      settings,
      config,
      loading,
      setWidgetSettings,
      widget,
      options,
      setModalMetaSettings
    } = this.props;
    const { tooltipOpen } = this.state;
    return (
      <Fragment>
        <Tooltip
          className="widget-tooltip-theme"
          theme="light"
          position="bottom-right"
          offset={-95}
          trigger="click"
          interactive
          onRequestClose={() => {
            const isTargetOnTooltip = isParent(
              this.widgetSettingsRef,
              this.widgetSettingsRef.evt
            );
            this.widgetSettingsRef.clearEvt();

            if (!modalClosing && !isTargetOnTooltip) {
              this.setState({ tooltipOpen: false });
            }
          }}
          onShow={() => this.setState({ tooltipOpen: true })}
          arrow
          useContext
          open={tooltipOpen}
          html={
            <WidgetSettings
              ref={node => {
                this.widgetSettingsRef = node;
              }}
              widget={widget}
              settings={settings}
              config={config}
              options={options}
              loading={loading}
              onSettingsChange={setWidgetSettings}
              setModalMetaSettings={setModalMetaSettings}
            />
          }
        >
          <Button
            className="theme-button-small square"
            tooltip={{ text: 'Filter and customize the data' }}
            trackingData={{
              event: 'open-settings',
              label: `${title} in ${locationName || ''}`
            }}
          >
            <Icon icon={settingsIcon} className="settings-icon" />
          </Button>
        </Tooltip>
        <div className="separator" />
      </Fragment>
    );
  };

  renderMetadataButton = () => {
    const { metakey, setModalMetaSettings, simple } = this.props;
    return (
      <Button
        theme={cx('theme-button-small square', {
          'theme-button-grey-filled theme-button-xsmall': simple
        })}
        onClick={() => setModalMetaSettings(metakey)}
        tooltip={{ text: 'Learn more about the data' }}
      >
        <Icon icon={infoIcon} />
      </Button>
    );
  };

  renderShareButton = () => {
    const { shareData, setShareModal } = this.props;
    return (
      <Button
        className="theme-button-small square"
        onClick={() => setShareModal(shareData)}
        tooltip={{ text: 'Share or embed this widget' }}
      >
        <Icon icon={shareIcon} />
      </Button>
    );
  };

  generateZipFromURL = urls => {
    const urlToPromise = url =>
      new Promise((resolve, reject) => {
        JSZipUtils.getBinaryContent(url, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

    const zip = new JSZip();
    urls.forEach((url, index) => {
      let filename;
      try {
        filename = url
          .split('?')[0]
          .split('/')
          .pop();
      } catch (error) {
        filename = `file ${index + 1}.csv`;
      }
      zip.file(filename, urlToPromise(url), { binary: true });
    });
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'data.zip');
    });
  };

  renderDownloadButton = () => {
    const params = { ...this.props.location, ...this.props.settings };
    const urls = this.props.getDataURL(params);
    return (
      <Button
        className="theme-button-small square"
        onClick={() => this.generateZipFromURL(urls)}
        tooltip={{ text: 'Download data for this widget' }}
      >
        <Icon icon={downloadIcon} />
      </Button>
    );
  };

  render() {
    const {
      title,
      settings,
      options,
      embed,
      config,
      simple,
      getDataURL
    } = this.props;

    return (
      <div className={cx('c-widget-header', { simple })}>
        <div className="title">{title}</div>
        <div className="options">
          {!embed &&
            !simple &&
            (config.layers || config.datasets) &&
            !config.hideLayers &&
            this.renderMapButton()}
          {!embed &&
            !simple &&
            settings &&
            options &&
            !config.hideSettings &&
            this.renderSettingsButton()}
          <div className="small-options">
            {this.renderMetadataButton()}
            {getDataURL && this.renderDownloadButton()}
            {!simple && this.renderShareButton()}
          </div>
        </div>
      </div>
    );
  }
}

WidgetHeader.propTypes = {
  widget: PropTypes.string,
  title: PropTypes.string.isRequired,
  settings: PropTypes.object,
  location: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  options: PropTypes.object,
  setShareModal: PropTypes.func.isRequired,
  shareData: PropTypes.object.isRequired,
  setModalMetaSettings: PropTypes.func.isRequired,
  modalClosing: PropTypes.bool,
  active: PropTypes.bool,
  config: PropTypes.object,
  locationName: PropTypes.string,
  isDeviceTouch: PropTypes.bool,
  embed: PropTypes.bool,
  loading: PropTypes.bool,
  simple: PropTypes.bool,
  setWidgetSettings: PropTypes.func,
  setActiveWidget: PropTypes.func,
  metakey: PropTypes.string,
  getDataURL: PropTypes.func
};

export default WidgetHeader;
