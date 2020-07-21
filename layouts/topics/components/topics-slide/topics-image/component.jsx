import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import lottie from 'lottie-web';
import { track } from 'app/analytics';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import infoIcon from 'assets/icons/info.svg?sprite';
import { Tooltip } from 'react-tippy';

import './styles.scss';

class TopicsImage extends PureComponent {
  componentDidMount() {
    lottie.setQuality(2);
    this.animations = {};
    const { animations } = this.props;
    if (animations && animations.length) {
      this.renderAnimations(animations);
    }
  }

  componentDidUpdate(prevProps) {
    const { animations } = this.props;
    const { animations: prevAnimations } = prevProps;
    if (animations && !isEqual(animations, prevAnimations)) {
      if (prevAnimations && prevAnimations.length) {
        this.destroyAnimations(prevAnimations);
      }
      lottie.setQuality(2);
      this.renderAnimations(animations);
    }
  }

  componentWillUnmount() {
    lottie.destroy();
  }

  destroyAnimations = (animations) => {
    animations.forEach(
      (a) =>
        this.animations &&
        this.animations[a.id] &&
        this.animations[a.id].destroy()
    );
  };

  renderAnimations = (animations) => {
    animations.forEach((a) => {
      if (a.type !== 'svg') {
        this.animations[a.id] = lottie.loadAnimation({
          wrapper: this.svgWrappers[a.id],
          animType: 'svg',
          loop: true,
          animationData: a.data,
        });
      }
    });
  };

  render() {
    const {
      img1x,
      img2x,
      description,
      prompts,
      animations,
      leaving,
      topic,
    } = this.props;

    return (
      <div className="c-topics-image">
        <img
          {...(img2x && {
            srcSet: `${img2x} 2x, ${img1x} 1x`,
            src: `${img1x} 1x`,
          })}
          {...(!img2x && {
            src: img1x,
          })}
          alt={description}
        />
        {animations &&
          animations.map((a) =>
            a.type === 'svg' ? (
              <svg
                key={a.id}
                className={a.className || ''}
                viewBox={a.viewBox || '0 0 32 32'}
                style={{
                  left: `${a.position[0]}%`,
                  top: `${a.position[1]}%`,
                }}
              >
                <use xlinkHref={`#${a.data.id || a.data}`} />
              </svg>
            ) : (
              <div
                key={a.id}
                className="svg-animation"
                id={a.id}
                style={{
                  zIndex: a.behind ? 0 : 2,
                }}
                ref={(ref) => {
                  this.svgWrappers = {
                    ...this.svgWrappers,
                    [a.id]: ref,
                  };
                }}
              />
            )
          )}
        {prompts &&
          prompts.map((p) => (
            <Fragment key={p.id}>
              <Tooltip
                className="image-info"
                style={{
                  left: `${p.position[0]}%`,
                  top: `${p.position[1]}%`,
                }}
                theme="light"
                interactive
                arrow
                disabled={leaving}
                sticky
                stickyDuration={0}
                html={(
                  <div className="c-topics-info-tooltip">
                    <p>{p.content}</p>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          theme="theme-button-small"
                          onClick={() => {
                            track('topicsImageBubble', {
                              label: `${topic}: ${p.content}`,
                            });
                          }}
                        >
                          {p.btnText}
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              >
                <Button className="info-btn" theme="theme-button-small square">
                  <Icon icon={infoIcon} />
                </Button>
              </Tooltip>
            </Fragment>
          ))}
      </div>
    );
  }
}

TopicsImage.propTypes = {
  img1x: PropTypes.string.isRequired,
  img2x: PropTypes.string,
  description: PropTypes.string,
  prompts: PropTypes.array,
  animations: PropTypes.array,
  leaving: PropTypes.bool,
  topic: PropTypes.string,
};

export default TopicsImage;
