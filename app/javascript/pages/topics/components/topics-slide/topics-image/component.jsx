import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import infoIcon from 'assets/icons/info.svg';
import { Tooltip } from 'react-tippy';
import data from './data.json';

import './styles.scss';

class TopicsImage extends PureComponent {
  componentDidMount() {
    lottie.loadAnimation({
      wrapper: this.wrapper,
      animType: 'svg',
      loop: true,
      animationData: data
    });
  }

  render() {
    const { img1x, img2x, description, prompts } = this.props;

    return (
      <div className="c-topics-image">
        <img
          srcSet={`${img1x} 2x, ${img2x} 1x`}
          src={`${img1x} 1x`}
          alt={description}
        />
        <div
          ref={ref => {
            this.wrapper = ref;
          }}
          id="svg-container"
        />
        {prompts &&
          prompts.map(p => (
            <Fragment key={p.id}>
              <Tooltip
                className="image-info"
                style={{
                  left: `${p.position[0]}%`,
                  top: `${p.position[1]}%`
                }}
                theme="light"
                interactive
                arrow
                sticky
                html={
                  <div className="c-topics-info-tooltip">
                    <p>{p.content}</p>
                    {p.link && (
                      <Button theme="theme-button-small" extLink={p.link}>
                        {p.btnText}
                      </Button>
                    )}
                  </div>
                }
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
  img2x: PropTypes.string.isRequired,
  description: PropTypes.string,
  prompts: PropTypes.array
};

export default TopicsImage;
