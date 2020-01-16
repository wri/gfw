import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { isParent } from 'utils/dom';
import cx from 'classnames';
import JSZip from 'jszip';
import snakeCase from 'lodash/snakeCase';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { track } from 'app/analytics';
import moment from 'moment';

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

  renderDownloadButton = () => {
    const { downloadLink } = this.props;

    return (
      <Fragment>
        <Button
          className={cx('download-button')}
          theme="theme-button-small square"
          tooltip={{ text: 'Download data for this view' }}
          extLink={downloadLink}
        >
          <Icon icon={downloadIcon} className="download-icon" />
        </Button>
        <div className="separator" />
      </Fragment>
    );
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
      setModalMetaSettings,
      downloadLink
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
        {!downloadLink && <div className="separator" />}
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

  generateZipFromURL = files => {
    const {
      title,
      config,
      settings,
      allLocation,
      locationData,
      childLocationData,
      locationObject
    } = this.props;
    const { metaKey } = config;

    const metadata = {
      title,
      ...(settings && {
        ...Object.keys(settings).reduce(
          (obj, key) => ({
            ...obj,
            ...(!['activeData', 'page', 'page_size', 'ifl'].includes(key) && {
              [snakeCase(key)]: settings[key]
            })
          }),
          {}
        )
      }),
      date_downloaded: moment().format('YYYY-MM-DD'),
      metadata: `https://production-api.globalforestwatch.org/v1/gfw-metadata/${
        metaKey
      }`,
      link: 'https://www.globalforestwatch.org'.concat(
        allLocation.pathname,
        '?',
        allLocation.search
      )
    };

    const metadataFile = Object.entries(metadata)
      .map(entry => `${entry[0]},${entry[1]}`)
      .join('\n');

    let adminLevel = (locationObject && locationObject.adminLevel) || 'global';
    if (adminLevel === 'adm0') adminLevel = 'iso';
    let childAdminLevel = 'adm2';
    if (adminLevel === 'global') childAdminLevel = 'iso';
    if (adminLevel === 'iso') childAdminLevel = 'adm1';

    const locationMetadataFile =
      locationData &&
      adminLevel !== 'global' &&
      [`name,${adminLevel}`]
        .concat(locationData.map(entry => `${entry.label},${entry.value}`))
        .join('\n');

    const childLocationMetadataFile =
      childLocationData &&
      [`name,${childAdminLevel}`]
        .concat(childLocationData.map(entry => `${entry.label},${entry.value}`))
        .join('\n');

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
    const filenames = [];
    const zip = new JSZip();
    files.forEach((file, index) => {
      const { name, url } = file;
      let filename;
      try {
        filename =
          name ||
          url
            .split('?')[0]
            .split('/')
            .pop();
        if (filenames.includes(filename)) {
          filename = filename.concat(`-${index}.csv`);
        } else {
          filenames.push(filename);
          filename = filename.concat('.csv');
        }
      } catch (error) {
        filename = `file ${index + 1}.csv`;
      }
      zip.file(filename, urlToPromise(url), { binary: true });
    });
    zip.file('metadata.csv', metadataFile);
    if (locationMetadataFile) {
      zip.file(`${adminLevel}_metadata.csv`, locationMetadataFile);
    }
    if (childLocationMetadataFile) {
      zip.file(`${childAdminLevel}_metadata.csv`, childLocationMetadataFile);
    }
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `${title}.zip`);
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
      getDataURL,
      downloadLink
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
          {!simple &&
            settings &&
            options &&
            config.options &&
            !config.hideSettings &&
            this.renderSettingsButton()}
          {downloadLink && this.renderDownloadButton()}
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
  getDataURL: PropTypes.func,
  downloadLink: PropTypes.string,
  allLocation: PropTypes.string,
  locationData: PropTypes.array,
  childLocationData: PropTypes.array,
  locationObject: PropTypes.object
};

export default WidgetHeader;
