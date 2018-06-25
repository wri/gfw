import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LayerToggle from 'pages/map/menu/components/layer-toggle';

import './layers-block-styles.scss';

class LayersBlock extends PureComponent {
  render() {
    const { name, description, layers } = this.props;
    return (
      <div className="c-layers-block">
        {(name || description) && (
          <div className="c-layers-block__header">
            {name && <div className="c-layers-block__title">{name}</div>}
            {description && (
              <div className="c-layers-block__description">{description}</div>
            )}
          </div>
        )}
        {layers &&
          layers.map(layer => (
            <LayerToggle key={`toogle-${layer.name}`} data={layer} />
          ))}
      </div>
    );
  }
}

LayersBlock.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  layers: PropTypes.array
};

export default LayersBlock;
