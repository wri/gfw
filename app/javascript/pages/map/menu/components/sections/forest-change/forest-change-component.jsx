import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LayerToggle from 'pages/map/menu/components/layer-toggle';
import MenuBlock from 'pages/map/menu/components/menu-block';

import './forest-change-styles.scss';

class ForestChange extends PureComponent {
  render() {
    const { data, datasets, layers } = this.props;

    return (
      <div className="c-forest-change">
        {datasets &&
          datasets.map(d => (
            // <MenuBlock key={`menu-block-forest-${i}`} {...block}>
              // {layers &&
                // layers.map(layer => (
                  <LayerToggle key={`toogle-${d.name}`} data={d} layers={layers} />
                // ))}
            // </MenuBlock>
          ))
        }
      </div>
    );
  }
}

ForestChange.propTypes = {
  data: PropTypes.array
};

export default ForestChange;
