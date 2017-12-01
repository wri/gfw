import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

import 'styles/themes/dropdown/dropdown-dark.scss';
import 'styles/themes/dropdown/dropdown-light.scss';
import 'styles/themes/dropdown/dropdown-button.scss';
import './dropdown-styles.scss';

class Dropdown extends PureComponent {
  render() {
    const { theme, label } = this.props;
    return (
      <div className={`c-dropdown ${theme}`}>
        {label && <div className="label">{label}</div>}{' '}
        <Select
          iconRenderer={() => (
            <svg className="icon icon-angle-arrow-down">
              <use xlinkHref="#icon-angle-arrow-down">{}</use>
            </svg>
          )}
          {...this.props}
        />
      </div>
    );
  }
}

Dropdown.propTypes = {
  label: PropTypes.string,
  theme: PropTypes.string
};

export default Dropdown;
