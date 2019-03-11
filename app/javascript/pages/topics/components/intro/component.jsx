import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import tiger from 'pages/topics/assets/biodiversity/tiger.png';
import tiger2x from 'pages/topics/assets/biodiversity/tiger@2x.png';

import './styles.scss';

class Intro extends PureComponent {
  render() {
    const { intro } = this.props;
    const { img, title, text, alt } = intro;
    const images = {
      '1x': {
        tiger
      },
      '2x': {
        tiger: tiger2x
      }
    };
    return (
      <div className="c-topics-intro">
        <div className="row titleRow">
          <div className="column small-12 medium-6 titleCol">
            <div className="intro-img-wrapper">
              <div className="intro-img">
                <img
                  srcSet={`${images['1x'][img]} 1x, ${images['2x'][img]} 2x`}
                  src={images['1x'][img]}
                  alt={alt}
                />
              </div>
            </div>
          </div>
          <div className="column small-12 medium-6 titleCol">
            <h1 className="intro-title">{title}</h1>
          </div>
        </div>
        <div className="row">
          <div className="column small-12 medium-6" />
          <div className="column small-12 medium-6">
            <p className="intro-text">{text}</p>
          </div>
        </div>
      </div>
    );
  }
}

Intro.propTypes = {
  intro: PropTypes.object
};

export default Intro;
