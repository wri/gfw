import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';

import Map from 'components/maps/main-map';
import MapTour from 'components/map-v2/components/map-tour';
import ModalMeta from 'components/modals/meta';
import ModalWelcome from 'components/modals/welcome';
import ModalSource from 'components/modals/sources';
import Share from 'components/modals/share';

import './styles.scss';

class MapPage extends PureComponent {
  static propTypes = {
    embed: PropTypes.bool,
    isDesktop: PropTypes.bool
  };

  render() {
    return (
      <div className="l-map">
        <Map />
        <Share />
        <ModalMeta />
        <ModalSource />
        <CountryDataProvider />
        <WhitelistsProvider />
        <DatasetsProvider />
        <LatestProvider />
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
