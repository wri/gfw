import React, { PureComponent } from 'react';

import CountryDataProvider from 'providers/country-data-provider';
import Map from 'components/map';
import MapMenu from 'pages/map/menu';
import ModalMeta from 'components/modals/meta';
import Meta from 'components/meta';
import Share from 'components/modals/share';

import './page-styles.scss';

class Page extends PureComponent {
  render() {
    return (
      <div className="l-map">
        <CountryDataProvider />
        <Map activeWidget={null} />
        <MapMenu />
        <Share />
        <ModalMeta />
        {/* <Meta
          title={title}
          description="Data about forest change, tenure, forest related employment and land use in"
        /> */}
      </div>
    );
  }
}

export default Page;
