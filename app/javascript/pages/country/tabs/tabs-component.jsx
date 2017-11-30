import React from 'react';

import './tabs-styles.scss';

const Tabs = () => (
  <div className="c-tabs">
    <ul className="tabs-list">
      <li className="-selected">Summary</li>
      <li className="">Forest change</li>
      <li className="">Land cover</li>
    </ul>
  </div>
);

export default Tabs;
