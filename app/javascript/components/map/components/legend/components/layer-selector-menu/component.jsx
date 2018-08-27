import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LayerSelector from '../layer-selector';

import './styles.scss';

class LayerSelectorMenu extends PureComponent {
  render() {
    const {
      name,
      layerGroup,
      selected,
      options,
      groups,
      onChange,
      className,
      sentence
    } = this.props;
    const optionName = selected.group || name;

    return (
      <div className={`c-layer-selector-menu ${className || ''}`}>
        {groups &&
          !!groups.length && (
            <div className="menu-wrapper -group">
              <LayerSelector
                options={groups}
                value={selected}
                onChange={e => onChange(layerGroup, e)}
                name={optionName}
                sentence={sentence}
              />
            </div>
          )}
        {options &&
          !!options.length && (
            <div className="menu-wrapper">
              <LayerSelector
                options={options}
                value={selected}
                onChange={e => onChange(layerGroup, e)}
                name={optionName}
                sentence={sentence}
              />
            </div>
          )}
      </div>
    );
  }
}

LayerSelectorMenu.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  groups: PropTypes.array,
  layerGroup: PropTypes.object,
  onChange: PropTypes.func,
  selected: PropTypes.object,
  sentence: PropTypes.string
};

export default LayerSelectorMenu;
