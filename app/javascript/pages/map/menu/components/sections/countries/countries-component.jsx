import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';
import MenuBlock from 'pages/map/menu/components/menu-block';
import LayerToggle from 'pages/map/menu/components/layer-toggle';

import './countries-styles.scss';

class Countries extends PureComponent {
  render() {
    const { countries, data, search, setMenuCountries } = this.props;
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
                {i === 0 && (
                  <Dropdown
                    className="c-countries__select"
                    theme="theme-dropdown-light"
                    placeholder="Select a country"
                    noItemsFound="No country found"
                    noSelectedValue="Select a country"
                    value={search}
                    options={countries}
                    onChange={country => setMenuCountries({ search: country })}
                    searchable
                    clearable
                  />
                )}
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
  countries: PropTypes.array,
  data: PropTypes.array,
  search: PropTypes.object,
  setMenuCountries: PropTypes.func
};

export default Countries;
