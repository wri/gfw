import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';
import MenuBlock from 'pages/map/menu/components/menu-block';
import LayerToggle from 'pages/map/menu/components/layer-toggle';

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
                <Dropdown
                  theme="theme-dropdown-light"
                  placeholder="Select a country"
                  noItemsFound="No country found"
                  noSelectedValue="Select a country"
                  options={[]}
                  onChange={() => {}}
                  searchable
                  arrowPosition="left"
                  clearable
                />
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
