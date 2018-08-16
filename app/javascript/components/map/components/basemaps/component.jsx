import React from 'react';
import Dropdown from 'components/ui/dropdown';

import './styles.scss';

const value = 0;
const items = [{ label: 'Admin', value: 0 }, { label: 'Admin1', value: 1 }];

function Basemaps() {
  return (
    <div className="c-basemaps">
      <h2 className="text -title-s">Basemap Options</h2>
      <ul className="basemap-options-container">
        <li>
          <h3>Boundaries</h3>
          <Dropdown value={value} options={items} />
        </li>
        <li>
          <h3>Labels</h3>
          <Dropdown value={value} options={items} />
        </li>
      </ul>
    </div>
  );
}

export default Basemaps;
