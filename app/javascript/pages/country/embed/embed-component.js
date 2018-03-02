import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Widget from 'pages/country/widget';
import Share from 'components/share';
import CountryDataProvider from 'pages/country/providers/country-data-provider';
import WhitelistsProvider from 'pages/country/providers/whitelists-provider';
import ModalMeta from 'components/modal-meta';

import './embed-styles.scss';

class Embed extends PureComponent {
  render() {
    const { widgetKey } = this.props;

    return (
      <div className="c-embed">
        <div className="widget-wrapper">
          <Widget widget={widgetKey} embed />
        </div>
        <Share />
        <ModalMeta />
        <CountryDataProvider />
        <WhitelistsProvider />
      </div>
    );
  }
}

Embed.propTypes = {
  widgetKey: PropTypes.string.isRequired
};

export default Embed;
