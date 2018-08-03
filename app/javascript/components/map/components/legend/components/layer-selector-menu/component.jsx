import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class LayerSelectorMenu extends PureComponent {
  render() {
    const {
      name,
      layerGroup,
      selectedOption,
      options,
      onChange,
      className
    } = this.props;

    return (
      <div className={`c-layer-selector-menu ${className || ''}`}>
        <span>{`Displaying ${name} for`}</span>
        <Dropdown
          className="layer-selector"
          theme="theme-dropdown-button-small"
          value={selectedOption}
          options={options}
          onChange={value => onChange(layerGroup, value.value)}
        />
      </div>
    );
  }
}

LayerSelectorMenu.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  layerGroup: PropTypes.object,
  onChange: PropTypes.func,
  selectedOption: PropTypes.object
};

export default LayerSelectorMenu;
