import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';

import './styles.scss';

class Intro extends PureComponent {
  render() {
    const { intro, className, handleSkipToTools } = this.props;
    const { img, title, text } = intro;

    return (
      <div className={cx('c-topics-intro', className)}>
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
            <Button
              theme="theme-button-light skip-to-tools"
              onClick={handleSkipToTools}
            >
              Related tools
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Intro.propTypes = {
  intro: PropTypes.object,
  className: PropTypes.string,
  handleSkipToTools: PropTypes.func
};

export default Intro;
