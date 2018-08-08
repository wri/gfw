import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class LayerSelectorMenu extends PureComponent {
  render() {
    const {
      name,
      layerGroup,
      selected,
      options,
      onChange,
      className
    } = this.props;

    return (
      <div className={`c-layer-selector-menu ${className || ''}`}>
        <span>{`Displaying ${name} for`}</span>
        <Dropdown
          className="layer-selector"
          theme="theme-dropdown-native-button"
          value={selected}
          options={options}
          onChange={e => onChange(layerGroup, e.target.value)}
          native
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
  selected: PropTypes.object
};

export default LayerSelectorMenu;
