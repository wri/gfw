import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class Intro extends PureComponent {
  render() {
    const { intro } = this.props;
    const { img, title, text } = intro;

    return (
      <div className="c-topics-intro">
        <div className="row titleRow">
          <div className="column small-12 medium-6 titleCol">
            <div className="intro-img-wrapper">
              <div className="intro-img">
                <svg viewBox={img.viewBox || '0 0 32 32'}>
                  <use xlinkHref={`#${img.id || img}`} />
                </svg>
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
