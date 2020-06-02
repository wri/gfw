import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { track } from 'app/analytics';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg';
import './styles.scss';

class Intro extends PureComponent {
  render() {
    const { intro, className, handleSkipToTools, isDesktop } = this.props;
    const { img1x, img2x, title, text, citation } = intro;

    return (
      <div className={cx('c-topics-intro', className)}>
        <div className="row titleRow">
          <div className="column small-12 medium-6 titleCol">
            {isDesktop &&
              img1x && (
              <div className="intro-img">
                <img
                  {...img2x && {
                    srcSet: `${img2x} 2x, ${img1x} 1x,`,
                    src: `${img1x} 1x`
                  }}
                  {...!img2x && {
                    src: img1x
                  }}
                  alt={title}
                />
              </div>
            )}
          </div>
          <div className="column small-12 medium-6 titleCol">
            <h1 className="intro-title">{title}</h1>
            {citation && (
              <a
                className="citation-link"
                href={citation}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track('topicsCitation', {
                    label: title
                  });
                }}
              >
                <Icon className="citation-icon" icon={infoIcon} />
              </a>
            )}
          </div>
        </div>
        <div className="row">
          <div className="column small-12 medium-6" />
          <div className="column small-12 medium-6">
            <p className="intro-text">{text}</p>
            {isDesktop && (
              <Button
                theme="theme-button-light skip-to-tools"
                onClick={handleSkipToTools}
              >
                Related tools
              </Button>
            )}
          </div>
        </div>
        {!isDesktop && (
          <div className="intro-img">
            <img
              srcSet={`${img1x} 2x, ${img2x} 1x,`}
              src={`${img1x} 1x`}
              alt={title}
            />
          </div>
        )}
      </div>
    );
  }
}

Intro.propTypes = {
  intro: PropTypes.object,
  className: PropTypes.string,
  handleSkipToTools: PropTypes.func,
  isDesktop: PropTypes.bool
};

export default Intro;
