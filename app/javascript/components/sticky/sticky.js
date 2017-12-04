import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';

import StickyComponent from './sticky-component';

class StickyContainer extends PureComponent {
  constructor() {
    super();
    this.state = {
      fixedLimit: 0,
      isFixed: false,
      top: 0,
      stickyDivPos: 0
    };
  }

  getStickyDiv = el => {
    this.setState({
      stickyDivPos:
        el.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top
    });
  };

  setStickyState = (state, top) => {
    this.setState({ isFixed: state, top });
  };

  handleScrollCallback = () => {
    const { isFixed, fixedLimit, stickyDivPos } = this.state;
    const { offSet, limitElement } = this.props;
    const currentPos = window.pageYOffset;
    const stickyPos = offSet ? stickyDivPos + offSet : stickyDivPos;

    // find limit element y pos
    if (!fixedLimit) {
      this.setState({
        fixedLimit: limitElement
          ? document.getElementById(limitElement).offsetTop - window.innerHeight
          : document.body.scrollHeight
      });
    }

    // not fixed when less than container div
    if (isFixed && currentPos < stickyPos) {
      this.setStickyState(false, 0);
    }

    // fixed between div at top (+ offset) and limitEl
    if (!isFixed && currentPos >= stickyPos && currentPos < fixedLimit) {
      this.setStickyState(true, 0);
    }

    // greater than limitEl
    if (isFixed && currentPos >= fixedLimit) {
      this.setStickyState(false, fixedLimit - stickyPos);
    }
  };

  render() {
    const { isFixed, top } = this.state;
    return createElement(StickyComponent, {
      isFixed,
      top,
      getStickyDiv: this.getStickyDiv,
      handleScrollCallback: this.handleScrollCallback,
      ...this.props
    });
  }
}

StickyContainer.propTypes = {
  offSet: PropTypes.number,
  limitElement: PropTypes.string
};

StickyContainer.defaultProps = {
  offSet: 0
};

export default StickyContainer;
