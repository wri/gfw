import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ScrollTo extends PureComponent {
  componentDidMount() {
    setTimeout(this.handleScroll, this.props.delay);
  }

  handleFadeOut = (el) => {
    el.style.backgroundColor = null; // eslint-disable-line
  };

  handleFadeIn = (el) => {
    const initialColor = el.style.backgroundColor;
    el.style.transition = 'background-color 1.5s linear'; // eslint-disable-line
    el.style.backgroundColor = '#fefedc'; // eslint-disable-line
    setTimeout(() => this.handleFadeOut(el, initialColor), 5000);
  };

  handleScroll = () => {
    const { target, afterScroll } = this.props;
    if (target) {
      const targetBox = target.getBoundingClientRect();
      window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: targetBox.top - 100,
      });
      this.handleFadeIn(target);
    }
    if (afterScroll) {
      afterScroll();
    }
  };

  render() {
    return null;
  }
}

ScrollTo.propTypes = {
  target: PropTypes.object,
  delay: PropTypes.number,
  afterScroll: PropTypes.number,
};

ScrollTo.defaultProps = {
  delay: 500,
};

export default ScrollTo;
