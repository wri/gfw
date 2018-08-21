import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

const options = [
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
  { label: '20%', value: 20 },
  { label: '25%', value: 25 },
  { label: '30%', value: 30 },
  { label: '50%', value: 50 },
  { label: '75%', value: 75 }
];

class ThresholdSelector extends PureComponent {
  render() {
    const { threshold, onChange, layerData, className } = this.props;
    const { name } = layerData || {};

    return (
      <div className={`c-threshold-selector ${className || ''}`}>
        <span>{`Displaying ${name ? name.toLowerCase() : ''} with`}</span>
        <Dropdown
          className="thresh-dropdown"
          theme="theme-dropdown-native-button"
          value={threshold}
          options={options}
          onChange={e => onChange(layerData, parseInt(e.target.value, 10))}
          native
        />
        <span>canopy density.</span>
      </div>
    );
  }
}

ThresholdSelector.propTypes = {
  className: PropTypes.string,
  threshold: PropTypes.number,
  onChange: PropTypes.func,
  layerData: PropTypes.object
};

export default ThresholdSelector;
