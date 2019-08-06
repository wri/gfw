import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AoICard from 'components/aoi-card';

import './styles.scss';

class AreasTable extends PureComponent {
  static propTypes = {
    areas: PropTypes.array
  };

  render() {
    const { areas } = this.props;

    return (
      <div className="c-areas-table">
        {areas &&
          !!areas.length &&
          areas.map((area, i) => (
            <div key={area.id} className="area-row">
              <AoICard index={i} {...area} />
            </div>
          ))}
      </div>
    );
  }
}

export default AreasTable;
