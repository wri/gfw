import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Section extends PureComponent {
  render() {
    const { children, className } = this.props;
    return <div className={`c-section section ${className}`}>{children}</div>;
  }
}

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Section;
