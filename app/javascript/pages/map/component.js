import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import DatasetsProvider from 'providers/datasets-provider';

import Map from 'components/map-v2';
import MapTour from 'components/map-v2/components/map-tour';
import ModalMeta from 'components/modals/meta';
import ModalWelcome from 'components/modals/welcome';
import ModalSource from 'components/modals/sources';
import Share from 'components/modals/share';

import './styles.scss';

class MapPage extends PureComponent {
  static propTypes = {
    setMenuSettings: PropTypes.func,
    embed: PropTypes.bool,
    isDesktop: PropTypes.bool
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
        {!this.props.embed &&
          this.props.isDesktop && (
            <Fragment>
              <MapTour />
              <ModalWelcome />
            </Fragment>
          )}
      </div>
    );
  }
}

export default MapPage;
