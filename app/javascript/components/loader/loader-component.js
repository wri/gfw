import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import 'styles/themes/loader/loader-light.scss';
import './loader-styles.scss';

class Loader extends PureComponent {
  render() {
    const { className, theme } = this.props;
    return (
      <div className={`c-loader ${className} ${theme}`}>
        <div className="spinner" />
      </div>
    );
  }
}

Loader.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string
};

export default Loader;
