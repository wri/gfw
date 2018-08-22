import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class ParamsSelector extends PureComponent {
  render() {
    const { onChange, layerData, className, param, value } = this.props;
    const { options, key, prefix, suffix } = param;

    return (
      <div className={`c-params-selector ${className || ''}`}>
        <span>{prefix}</span>
        <Dropdown
          className="param-dropdown"
          theme="theme-dropdown-native-button"
          value={value}
          options={options}
          onChange={e => onChange(layerData, { [key]: e.target.value })}
          native
        />
        <span>{suffix}</span>
      </div>
    );
  }
}

ParamsSelector.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object
  ]),
  onChange: PropTypes.func,
  param: PropTypes.object,
  layerData: PropTypes.object
};

export default ParamsSelector;
