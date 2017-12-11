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
      stickyDivPos: {
        top: 0
      },
      scrollPos: 0,
      el: null
    };
  }

  componentDidMount() {
    this.handleScrollCallback();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.state.el.removeEventListener('scroll', this.handleScrollCallback);
  }

  getStickyDiv = el => {
    if (el) {
      this.setState({ el });
      const pos = el.getBoundingClientRect();
      this.setState({
        stickyDivPos: {
          top: pos.top - document.body.getBoundingClientRect().top,
          left: pos.left,
          width: pos.width
        }
      });
      el.addEventListener('scroll', this.handleScrollCallback);
    }
  };

  setElLimit = () => {
    const { limitElement } = this.props;
    this.setState({
      fixedLimit: limitElement
        ? document.getElementById(limitElement).offsetTop - window.innerHeight
        : document.body.scrollHeight
    });
  };

  handleResize = () => {
    const { el } = this.state;
    this.getStickyDiv(el);
    this.setElLimit();
    this.handleScrollCallback();
  };

  handleScrollCallback = () => {
    const { isFixed, fixedLimit, stickyDivPos, scrollPos } = this.state;
    const { offSet } = this.props;
    const stickyPos = offSet ? stickyDivPos.top + offSet : stickyDivPos.top;
    this.setState({ scrollPos: window.pageYOffset });

    // find limit element y pos
    if (!fixedLimit) {
      this.setElLimit();
    }

    // not fixed when less than container div
    if (isFixed && scrollPos < stickyPos) {
      this.setState({ isFixed: false, top: 0 });
    }

    // fixed between div at top (+ offset) and limitEl
    if (!isFixed && scrollPos >= stickyPos && scrollPos < fixedLimit) {
      this.setState({ isFixed: true, top: 0 });
    }

    // greater than limitEl
    if (isFixed && scrollPos >= fixedLimit) {
      this.setState({ isFixed: false, top: fixedLimit - stickyPos });
    }
  };

  render() {
    const { isFixed, top, stickyDivPos } = this.state;
    return createElement(StickyComponent, {
      isFixed,
      top,
      stickyDivPos,
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
