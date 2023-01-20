import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/Image';

import tree from 'assets/icons/tree.png';

import './styles.module.scss';

const NoContent = ({ className, message, icon, children }) => (
  <div className={`c-no-content ${className}`}>
    <p className="message">
      {children || message}
      {icon && <Image className="message-icon" src={tree} alt="tree" />}
    </p>
  </div>
);

NoContent.propTypes = {
  icon: PropTypes.bool,
  className: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node,
};

NoContent.defaultProps = {
  icon: false,
};

export default NoContent;
