import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ScrollEvent from 'react-onscroll';

import './sticky-styles';

class Sticky extends PureComponent {
  render() {
    const {
      children,
      handleScrollCallback,
      className,
      isFixed,
      top,
      getStickyDiv,
      stickyDivPos
    } = this.props;

    return (
      <div ref={getStickyDiv} className="sticky-container">
        <div
          className={`sticky ${className} ${isFixed ? '-fixed' : ''}`}
          style={{ top, left: stickyDivPos.left, width: stickyDivPos.width }}
        >
          <ScrollEvent handleScrollCallback={handleScrollCallback} />
          {children}
        </div>
      </div>
    );
  }
}

Sticky.propTypes = {
  children: PropTypes.node.isRequired,
  getStickyDiv: PropTypes.func.isRequired,
  handleScrollCallback: PropTypes.func.isRequired,
  className: PropTypes.string,
  isFixed: PropTypes.bool.isRequired,
  top: PropTypes.number.isRequired,
  stickyDivPos: PropTypes.object.isRequired
};

export default Sticky;
