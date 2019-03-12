import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class Section extends PureComponent {
  render() {
    const { children, className } = this.props;
    return <div className={`c-section section ${className}`}>{children}</div>;
  }
}

Section.propTypes = {
  // anchors: PropTypes.array,
  children: PropTypes.node,
  className: PropTypes.string
};

export default Section;
