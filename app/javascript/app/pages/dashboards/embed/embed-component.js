import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Widgets from 'components/widgets';
import CountryDataProvider from 'providers/country-data-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import Share from 'components/modals/share';
import ModalMeta from 'components/modals/meta';

import './embed-styles.scss';

class Embed extends PureComponent {
  render() {
    const { payload, query } = this.props;
    return (
      <div className="c-embed">
        <div className="widget-wrapper">
          <Widgets location={payload} query={query} embed />
        </div>
        <Share />
        <ModalMeta />
        <CountryDataProvider location={payload} />
        <WhitelistsProvider />
      </div>
    );
  }
}

Embed.propTypes = {
  payload: PropTypes.object,
  query: PropTypes.object
};

export default Embed;
