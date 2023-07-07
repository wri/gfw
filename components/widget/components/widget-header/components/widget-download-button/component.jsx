import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import isEmpty from 'lodash/isEmpty';
import snakeCase from 'lodash/snakeCase';
import JSZipUtils from 'jszip-utils';
import moment from 'moment';
import { saveAs } from 'file-saver';
import cx from 'classnames';

import { trackEvent } from 'utils/analytics';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import downloadIcon from 'assets/icons/download.svg?sprite';
import { GFW_API } from 'utils/apis';

const GLAD_ALERTS_WIDGET = 'gladAlerts';

const isServer = typeof window === 'undefined';

class WidgetDownloadButton extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    disabledMessage: PropTypes.string,
    getDataURL: PropTypes.func,
    gladAlertsDownloadUrls: PropTypes.object,
    settings: PropTypes.object,
    title: PropTypes.string,
    parentData: PropTypes.object,
    locationData: PropTypes.object,
    childData: PropTypes.object,
    location: PropTypes.object,
    adminLevel: PropTypes.string,
    metaKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    simple: PropTypes.bool,
    widget: PropTypes.string,
    areaTooLarge: PropTypes.bool,
    status: PropTypes.string,
    mapSettings: PropTypes.object,
    geostore: PropTypes.object,
    meta: PropTypes.object,
  };

  state = {
    disabled: false,
  };

  generateZipFromURL = async () => {
    const {
      title,
      settings,
      parentData,
      childData,
      adminLevel: intAdminLevel,
      metaKey,
      getDataURL,
      location,
      mapSettings,
      geostore,
      meta,
      status,
    } = this.props;
    const params = {
      ...location,
      ...settings,
      GFW_META: meta,
      mapSettings,
      geostore,
      status,
    };
    let { locationData } = this.props;

    let files = [];

    if (getDataURL) {
      files = await getDataURL(params);
    }

    const metadata = {
      title,
      ...(settings && {
        ...Object.keys(settings).reduce(
          (obj, key) => ({
            ...obj,
            ...(![
              'interaction',
              'activeData',
              'page',
              'page_size',
              'ifl',
              'yearsRange',
            ].includes(key) && {
              [snakeCase(key)]: snakeCase(settings[key]),
            }),
          }),
          {}
        ),
      }),
      date_downloaded: moment().format('YYYY-MM-DD'),
      metadata: `https://api.resourcewatch.org/v1/gfw-metadata/${metaKey}`,
      link: !isServer && window.location.href,
    };

    const metadataFile = Object.entries(metadata)
      .map((entry) => `${entry[0]},${entry[1]}`)
      .join('\n');

    let parentAdminLevel = 'global';
    let adminLevel = intAdminLevel || 'global';
    let childAdminLevel = 'adm2';

    if (adminLevel === 'global') {
      childAdminLevel = 'iso';
    }
    if (adminLevel === 'adm0') {
      adminLevel = 'iso';
      childAdminLevel = 'adm1';
    }
    if (adminLevel === 'adm1') {
      parentAdminLevel = 'iso';
    }
    if (adminLevel === 'adm2') {
      parentAdminLevel = 'adm1';
    }
    if (location.type === 'geostore') {
      parentAdminLevel = null;
      adminLevel = 'geostore';
      childAdminLevel = null;
    }

    const parentLocationMetadataFile =
      !isEmpty(parentData) &&
      adminLevel !== 'global' &&
      adminLevel !== 'iso' &&
      [`name,${parentAdminLevel}${parentAdminLevel !== 'iso' ? '__id' : ''}`]
        .concat(
          Object.values(parentData).map(
            (entry) => `"${entry.label}","${entry.value}"`
          )
        )
        .join('\n');

    let locationMetadataFile =
      !isEmpty(locationData) &&
      adminLevel !== 'global' &&
      location.type !== 'geostore' &&
      [`name,${adminLevel}${adminLevel !== 'iso' ? '__id' : ''}`]
        .concat(
          Object.values(locationData).map(
            (entry) => `"${entry.label}","${entry.value}"`
          )
        )
        .join('\n');

    if (location.type === 'geostore') {
      locationData = locationData
        ? locationData[location.adm0]
        : { [`${title || 'Selected Area'}`]: location.adm0 };
      locationMetadataFile =
        !isEmpty(locationData) &&
        [`name,${adminLevel}${adminLevel !== 'iso' ? '__id' : ''}`]
          .concat(
            Object.entries(locationData).map(
              (entry) =>
                `"${entry[0]}","${
                  entry[1] && typeof entry[1] !== 'object' ? entry[1] : ''
                }"`
            )
          )
          .join('\n');
    }

    const childLocationMetadataFile =
      !isEmpty(childData) &&
      location.type !== 'geostore' &&
      [`name,${childAdminLevel}${childAdminLevel !== 'iso' ? '__id' : ''}`]
        .concat(
          Object.values(childData).map(
            (entry) => `"${entry.label}","${entry.value}"`
          )
        )
        .join('\n');

    const urlToPromise = (url) =>
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
        filename = name || url.split('?')[0].split('/').pop();
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
    if (parentAdminLevel && parentLocationMetadataFile) {
      zip.file(`${parentAdminLevel}_metadata.csv`, parentLocationMetadataFile);
    }
    if (locationMetadataFile) {
      zip.file(`${adminLevel}_metadata.csv`, locationMetadataFile);
    }
    if (childAdminLevel && childLocationMetadataFile) {
      zip.file(`${childAdminLevel}_metadata.csv`, childLocationMetadataFile);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${title}.zip`);
      this.setState({ disabled: false });
    });
  };

  isGladAlertsWidget = () => {
    const { widget } = this.props;
    return widget === GLAD_ALERTS_WIDGET;
  };

  isCustomShape = () => {
    const { location, status } = this.props;
    return location && location.type === 'geostore' && status !== 'saved';
  };

  onClickDownloadBtn = () => {
    const { gladAlertsDownloadUrls } = this.props;
    const { disabled } = this.state;

    if (disabled) return;

    this.setState({ disabled: true });

    if (this.isGladAlertsWidget() && this.isCustomShape()) {
      const csvFile = `${GFW_API}${gladAlertsDownloadUrls.csv}`;
      saveAs(csvFile, 'download');
    } else {
      this.generateZipFromURL();
    }
    trackEvent({
      category: 'Dashboards page',
      action: 'Download widget',
      label: this.props.widget,
    });

    setTimeout(() => {
      this.setState({ disabled: false });
    }, 2000);
  };

  render() {
    const { areaTooLarge, disabled, disabledMessage, widget } = this.props;
    const { disabled: localDisabled } = this.state;

    let tooltipText =
      this.isGladAlertsWidget() && this.isCustomShape()
        ? 'Download data. Please add .csv to the filename if extension is missing.'
        : 'Download data.';

    if (areaTooLarge) {
      tooltipText =
        'Your area is too large for downloading data! Please try again with an area smaller than 1 billion hectares (approximately the size of Brazil).';
    }

    if (disabled) {
      tooltipText = disabledMessage || 'Temporarily unavailable';
    }

    if (disabled && disabledMessage) {
      tooltipText = disabledMessage;
    }

    return (
      <Button
        id={`widget-download-button-${widget}`}
        className={cx('c-widget-download-button widget-control-button', {
          'small-download-button': this.props.simple,
        })}
        theme={cx('theme-button-small square', {
          'theme-button-grey-filled theme-button-xsmall': this.props.simple,
        })}
        onClick={this.onClickDownloadBtn}
        tooltip={{ text: tooltipText }}
        disabled={areaTooLarge || disabled || localDisabled}
      >
        <Icon icon={downloadIcon} className="download-icon" />
      </Button>
    );
  }
}

export default WidgetDownloadButton;
