import React, { PureComponent } from 'react';

import Widgets from 'components/widgets';
import CountryDataProvider from 'providers/country-data-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import Share from 'components/modals/share';
import ModalMeta from 'components/modals/meta';

import './embed-styles.scss';

class Embed extends PureComponent {
  render() {
    return (
      <div className="c-embed">
        <div className="widget-wrapper">
          <Widgets embed />
        </div>
        <Share />
        <ModalMeta />
        <CountryDataProvider />
        <WhitelistsProvider />
      </div>
    );
  }
}

export default Embed;
