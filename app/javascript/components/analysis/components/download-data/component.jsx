import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';

import './styles.scss';

class DownloadData extends PureComponent {
  generateZipFromURL = (url, format) => {
    const urlToPromise = _url =>
      new Promise((resolve, reject) => {
        JSZipUtils.getBinaryContent(_url, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

    const zip = new JSZip();
    let filename;
    try {
      const keywords = url.split('?')[0].split('/');
      filename = keywords[keywords.indexOf('download') - 1];
    } catch (error) {
      filename = 'data';
    }
    filename = filename.concat(`.${format}`);
    zip.file(filename, urlToPromise(url), { binary: true });
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'data.zip');
    });
  };

  renderDownloadLinks = downloads => (
    <Fragment key={downloads.label}>
      <span>{downloads.label}</span>
      <ul className="download-list">
        {downloads.urls.map(l => (
          <li key={l.url}>
            <a href="#" onClick={() => this.generateZipFromURL(l.url, l.label)}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </Fragment>
  );

  render() {
    const { onClose, downloadUrls } = this.props;

    return (
      <div className="c-download-data">
        <h4 className="title">Download Analysis Data</h4>
        <button onClick={onClose}>
          <Icon className="icon-close" icon={closeIcon} />
        </button>
        {downloadUrls &&
          !!downloadUrls.length &&
          downloadUrls.map(d => this.renderDownloadLinks(d))}
        <p className="terms">
          By downloading data you agree to the{' '}
          <a href="/terms" target="_blank">
            GFW Terms of Service
          </a>
        </p>
      </div>
    );
  }
}

DownloadData.propTypes = {
  onClose: PropTypes.func,
  downloadUrls: PropTypes.array
};

export default DownloadData;
