import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg?sprite';

import './styles.scss';

class DownloadData extends PureComponent {
  renderDownloadLinks = downloads => (
    <Fragment key={downloads.label}>
      <span>{downloads.label}</span>
      <ul className="download-list">
        {downloads.urls.map(l => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer">
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
