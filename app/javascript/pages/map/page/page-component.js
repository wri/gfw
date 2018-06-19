import React, { PureComponent } from 'react';

import Map from 'components/map';

import './page-styles.scss';

class Page extends PureComponent {
  render() {
    return (
      <div className="l-map">
        <Map />
      </div>
    );
  }
}

export default Page;
