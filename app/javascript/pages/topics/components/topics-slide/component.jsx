import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';

import TopicsText from './topics-text';
import TopicsImage from './topics-image';

import './styles.scss';

class TopicsSlide extends PureComponent {
  render() {
    const {
      isLast,
      isLeaving,
      subtitle,
      text,
      title,
      src,
      prompts,
      isDesktop,
      handleSkipToTools
    } = this.props;
    return (
      <div
        key={subtitle}
        className={cx(
          'c-topics-slide',
          { last: !isDesktop && isLast },
          { slide: isDesktop }
        )}
      >
        <div className="row">
          <div className="column small-12 medium-4">
            <div className="topic-content">
              <TopicsText
                className={cx('topic-text', {
                  leaving: isLeaving
                })}
                text={text}
                title={title}
                subtitle={subtitle}
              />
              {isDesktop && (
                <Button
                  className="topic-btn"
                  theme="theme-button-light"
                  onClick={handleSkipToTools}
                >
                  Related tools
                </Button>
              )}
            </div>
          </div>
          <div className="column small-12 medium-8">
            <div className="topic-image">
              <TopicsImage url={src} description={subtitle} prompts={prompts} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TopicsSlide.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  src: PropTypes.string,
  prompts: PropTypes.array,
  isLast: PropTypes.bool,
  isLeaving: PropTypes.bool,
  isDesktop: PropTypes.bool,
  handleSkipToTools: PropTypes.func
};

export default TopicsSlide;
