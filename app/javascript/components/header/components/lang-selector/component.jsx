import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class LangSelector extends PureComponent {
  render() {
    const {
      className
    } = this.props;

    return (
      <div className={`c-lang-selector ${className || ''}`}>
        <ul>
          <li>English</li>
          <li>French</li>
        </ul>
      </div>
    );
  }
}

LangSelector.propTypes = {
  className: PropTypes.string
};

export default LangSelector;
