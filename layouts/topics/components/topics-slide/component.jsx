import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button, Column, Row } from '@worldresources/gfw-components';

import TopicsText from './topics-text';
import TopicsImage from './topics-image';

// import './styles.scss';

const TopicsSlide = ({
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
}) => (
  <div
    key={subtitle}
    className={cx(
      'c-topics-slide',
      { last: !isDesktop && isLast },
      { slide: isDesktop }
    )}
  >
    <Row>
      <Column width={[1, 1 / 3]}>
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
            <Button light className="topic-btn" onClick={handleSkipToTools}>
              Related tools
            </Button>
          )}
        </div>
      </Column>
      <Column width={[1, 2 / 3]}>
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
      </Column>
    </Row>
  </div>
);

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
