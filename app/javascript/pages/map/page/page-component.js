import React, { PureComponent } from 'react';

import CountryDataProvider from 'providers/country-data-provider';
import Map from 'components/map';

import './page-styles.scss';

class Page extends PureComponent {
  render() {
    return (
      <div className="l-map">
        <CountryDataProvider />
        <Map activeWidget={null} />
      </div>
    );
  }
}

export default Page;
