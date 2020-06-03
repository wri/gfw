import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';
import Widgets from 'components/widgets';
import CountryDataProvider from 'providers/country-data-provider';
import GeodescriberProvider from 'providers/geodescriber-provider';
import GeostoreProvider from 'providers/geostore-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import AreasProvider from 'providers/areas-provider';
import Share from 'components/modals/share';
import ModalMeta from 'components/modals/meta';

import './styles.scss';
import './trase-embed-styles.scss';

class Embed extends PureComponent {
  render() {
    const { isTrase } = this.props;
    return (
      <div className={cx('c-embed', { '-trase': isTrase })}>
        <div className="widget-wrapper">
          <Widgets embed />
        </div>
        <Share />
        <ModalMeta />
        <CountryDataProvider />
        <WhitelistsProvider />
        <GeodescriberProvider />
        <AreasProvider />
        <GeostoreProvider />
      </div>
    );
  }
}

Embed.propTypes = {
  isTrase: PropTypes.bool
};

export default Embed;
