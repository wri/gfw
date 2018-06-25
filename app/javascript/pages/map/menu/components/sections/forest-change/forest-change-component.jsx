import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LayerToggle from 'pages/map/menu/components/layer-toggle';
import MenuBlock from 'pages/map/menu/components/menu-block';

class ForestChange extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className="c-forest-change">
        {data &&
          data.map((block, i) => {
            const { name, description, layers } = block;
            return (
              <MenuBlock
                key={`menu-block-forest-${i}`}
                name={name}
                description={description}
                layers={layers}
              >
                {layers &&
                  layers.map(layer => (
                    <LayerToggle key={`toogle-${layer.name}`} data={layer} />
                  ))}
              </MenuBlock>
            );
          })}
      </div>
    );
  }
}

ForestChange.propTypes = {
  data: PropTypes.array
};

export default ForestChange;
