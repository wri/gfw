import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';
import Section from 'pages/topics/components/section';
import Biodiversity from 'pages/topics/content/biodiversity.json';
import Carousel from 'components/ui/carousel';

class Topic extends PureComponent {
  mouseOver = false;
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = debounce(() => {
    // console.log('scrolling!');
    if (this.slider && this.mouseOver) {
      this.slider.slickNext();
    }
  }, 100);

  onMouseOver = () => {
    this.mouseOver = true;
    this.disableScroll();
  };

  onMouseOut = () => {
    this.mouseOver = false;
    this.enableScroll();
  };

  preventDefault(e) {
    const ev = e || window.event;
    if (ev.preventDefault) ev.preventDefault();
    ev.returnValue = false;
  }

  preventDefaultForScrollKeys(e) {
    if (this.keys && this.keys[e.keyCode]) {
      this.preventDefault(e);
      return false;
    }
    return null; // ?
  }

  disableScroll() {
    if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', this.preventDefault, false);
    }
    window.onwheel = this.preventDefault; // modern standard
    window.onmousewheel = this.preventDefault;
    document.onmousewheel = this.preventDefault;
    window.ontouchmove = this.preventDefault; // mobile
    document.onkeydown = this.preventDefaultForScrollKeys;
  }

  enableScroll() {
    if (window.removeEventListener) {
      window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
    }
    window.onmousewheel = null;
    document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
  }

  render() {
    const topics = {
      Biodiversity
    };
    const topic = topics[this.props.topic] || [];
    const settings = {
      slidesToShow: 1,
      vertical: true,
      swipeToSlide: true,
      swipe: true,
      ref: c => {
        this.slider = c;
      }
    };
    return (
      <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        <Carousel settings={settings}>
          {topic.map((s, i) => (
            <div key={s.subtitle}>
              <Section
                content={{
                  text: s.text,
                  title: s.title,
                  subtitle: s.subtitle
                }}
                imgURL={s.src}
                index={i}
              />
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}

Topic.propTypes = {
  topic: PropTypes.string
};

export default Topic;
