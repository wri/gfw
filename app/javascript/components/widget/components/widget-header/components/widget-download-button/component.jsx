import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import isEmpty from 'lodash/isEmpty';
import snakeCase from 'lodash/snakeCase';
import JSZipUtils from 'jszip-utils';
import moment from 'moment';
import { saveAs } from 'file-saver';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import downloadIcon from 'assets/icons/download.svg';

import './styles.scss';

class WidgetDownloadButton extends PureComponent {
  static propTypes = {
    getDataURL: PropTypes.func,
    settings: PropTypes.object,
    title: PropTypes.string,
    parentData: PropTypes.object,
    locationData: PropTypes.object,
    childData: PropTypes.object,
    adminLevel: PropTypes.object,
    metaKey: PropTypes.string
  };

  generateZipFromURL = () => {
    const {
      title,
      settings,
      parentData,
      locationData,
      childData,
      adminLevel: intAdminLevel,
      metaKey,
      getDataURL
    } = this.props;

    const params = { ...location, ...settings };
    const files = getDataURL && getDataURL(params);

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
              'ifl'
            ].includes(key) && {
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
      link: window.location.href
    };

    const metadataFile = Object.entries(metadata)
      .map(entry => `${entry[0]},${entry[1]}`)
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

    const parentLocationMetadataFile =
      !isEmpty(parentData) &&
      adminLevel !== 'global' &&
      adminLevel !== 'iso' &&
      [`name,${parentAdminLevel}${parentAdminLevel !== 'iso' ? '__id' : ''}`]
        .concat(
          Object.values(parentData).map(
            entry => `"${entry.label}","${entry.value}"`
          )
        )
        .join('\n');

    const locationMetadataFile =
      !isEmpty(locationData) &&
      adminLevel !== 'global' &&
      [`name,${adminLevel}${adminLevel !== 'iso' ? '__id' : ''}`]
        .concat(
          Object.values(locationData).map(
            entry => `"${entry.label}","${entry.value}"`
          )
        )
        .join('\n');

    const childLocationMetadataFile =
      !isEmpty(childData) &&
      [`name,${childAdminLevel}${childAdminLevel !== 'iso' ? '__id' : ''}`]
        .concat(
          Object.values(childData).map(
            entry => `"${entry.label}","${entry.value}"`
          )
        )
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
    if (parentLocationMetadataFile) {
      zip.file(`${parentAdminLevel}_metadata.csv`, parentLocationMetadataFile);
    }
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

  render() {
    return (
      <Button
        className="c-widget-download-button"
        theme="theme-button-small square"
        onClick={this.generateZipFromURL}
        tooltip={{ text: 'Download the data' }}
      >
        <Icon icon={downloadIcon} className="download-icon" />
      </Button>
    );
  }
}

export default WidgetDownloadButton;
