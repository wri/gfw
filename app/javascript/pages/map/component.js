import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import DatasetsProvider from 'providers/datasets-provider';

import Map from 'components/map-v2';
import ModalMeta from 'components/modals/meta';
import ModalSource from 'components/modals/sources';
import Share from 'components/modals/share';

import './styles.scss';

class MapPage extends PureComponent {
  static propTypes = {
    setMenuSettings: PropTypes.func
  };

  render() {
    return (
      <div className="l-map">
        <Map
          onMapClick={() => this.props.setMenuSettings({ menuSection: '' })}
        />
        <Share />
        <ModalMeta />
        <ModalSource />
        <CountryDataProvider />
        <WhitelistsProvider />
        <DatasetsProvider />
        <GeostoreProvider />
      </div>
    );
  }
}

export default MapPage;
