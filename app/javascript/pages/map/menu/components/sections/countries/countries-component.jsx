import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LayerToggle from 'pages/map/menu/components/layer-toggle';
import MenuBlock from 'pages/map/menu/components/menu-block';

class Countries extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className="c-countries">
        {data &&
          data.map((block, i) => {
            const { name, description, layers, text } = block;
            return (
              <MenuBlock
                key={`menu-block-countries-${i}`}
                name={name}
                description={description}
              >
                {layers &&
                  layers.map(layer => (
                    <LayerToggle key={`toogle-${layer.name}`} data={layer} />
                  ))}
                {text && (
                  <p
                    className="c-menu-block__text"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                )}
              </MenuBlock>
            );
          })}
      </div>
    );
  }
}

Countries.propTypes = {
  data: PropTypes.array
};

export default Countries;
