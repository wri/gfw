import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './loader-styles.scss';
import './themes/loader-light.scss'; // eslint-disable-line

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
