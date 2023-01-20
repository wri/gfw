import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.module.scss';
import './themes/loader-light.module.scss'; // eslint-disable-line

class Loader extends PureComponent {
  render() {
    const { className, theme, message } = this.props;
    return (
      <div className={`c-loader ${className} ${theme}`}>
        <div className="spinner" />
        {message && <p className="message">{message}</p>}
      </div>
    );
  }
}

Loader.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
  message: PropTypes.string,
};

export default Loader;
