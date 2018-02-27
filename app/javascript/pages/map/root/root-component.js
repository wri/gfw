import React, { PureComponent } from 'react';

import RecentImagery from 'pages/map/recent-imagery';

import './root-styles.scss';

class Root extends PureComponent {
  render() {
    return (
      <div className="l-map">
        <RecentImagery />
      </div>
    );
  }
}

export default Root;
