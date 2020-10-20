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
      img1x,
      img2x,
      prompts,
      animations,
      isDesktop,
      handleSkipToTools,
      leaving,
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
                  leaving: isLeaving,
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
              <TopicsImage
                topic={title}
                img1x={img1x}
                img2x={img2x}
                description={subtitle}
                prompts={prompts}
                animations={animations}
                leaving={leaving}
              />
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
  animations: PropTypes.array,
  text: PropTypes.string,
  img1x: PropTypes.string,
  img2x: PropTypes.string,
  prompts: PropTypes.array,
  isLast: PropTypes.bool,
  isLeaving: PropTypes.bool,
  leaving: PropTypes.bool,
  isDesktop: PropTypes.bool,
  handleSkipToTools: PropTypes.func,
};

export default TopicsSlide;
