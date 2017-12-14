import React from 'react';
import PropTypes from 'prop-types';

import tree from 'assets/icons/tree.png';
import './no-content-styles.scss';

const NoContent = ({ className, message, icon }) => (
  <div className={`c-no-content ${className}`}>
    <p className="message">{message}</p>
    {icon && <img className="message-icon" src={tree} alt="tree" />}
  </div>
);

NoContent.propTypes = {
  icon: PropTypes.bool,
  className: PropTypes.string,
  message: PropTypes.string
};

NoContent.defaultProps = {
  icon: false
};

export default NoContent;
