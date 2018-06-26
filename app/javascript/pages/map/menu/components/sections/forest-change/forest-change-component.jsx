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
            const { layers } = block;
            return (
              <MenuBlock
                key={`menu-block-forest-${i}`}
                {...block}
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
