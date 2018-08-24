import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class LayerSelector extends PureComponent {
  static defaultProps = {
    sentence: 'Displaying {name} for {selector}'
  };

  reduceSentence = (sentence, pattern, component) => {
    const split = sentence.split(pattern);
    return [split[0], component, split[1]];
  };

  render() {
    const { onChange, className, options, value, sentence, name } = this.props;

    const nameRepl = this.reduceSentence(
      sentence,
      '{name}',
      name && name.toLowerCase()
    ).join('');
    const selectorRepl = this.reduceSentence(
      nameRepl,
      '{selector}',
      <Dropdown
        key={name}
        className="layer-dropdown"
        theme="theme-dropdown-native-button"
        value={value}
        options={options}
        onChange={e => onChange(e.target.value)}
        native
      />
    );

    return (
      <div className={`c-layer-selector ${className || ''}`}>
        {selectorRepl}
      </div>
    );
  }
}

LayerSelector.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object
  ]),
  onChange: PropTypes.func,
  options: PropTypes.array,
  sentence: PropTypes.string,
  name: PropTypes.string
};

export default LayerSelector;
