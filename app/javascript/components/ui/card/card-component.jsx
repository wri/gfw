import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button/button-component';
import Dotdotdot from 'react-dotdotdot';
import cx from 'classnames';

import './card-styles.scss';
import './themes/card-small.scss';
import './themes/card-dark.scss';

class Card extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className, theme, data, active, tag, tagColour } = this.props;
    const { image, imageCredit, title, summary, meta, buttons } = data || {};

    return (
      <div className={cx('c-card', className, theme, { active })}>
        {tag &&
          tagColour && (
            <span className="tag" style={{ backgroundColor: tagColour }}>
              <p>{tag}</p>
            </span>
          )}
        {image && (
          <div className="image" style={{ backgroundImage: `url(${image})` }} />
        )}
        <div className={cx('body', { 'no-image': !image })}>
          <div className="text-content">
            {imageCredit && <span>{imageCredit}</span>}
            {title && <h3 className="title">{title}</h3>}
            {summary && (
              <div className="summary">
                <Dotdotdot clamp={3}>{summary}</Dotdotdot>
              </div>
            )}
            {meta && <p className="meta">{meta}</p>}
          </div>
          {buttons && (
            <div className="buttons">
              {buttons.map((button, i) => (
                <Button
                  key={`card-button-${i}`}
                  theme="theme-button-light"
                  {...button}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  theme: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  tag: PropTypes.string,
  tagColour: PropTypes.string
};

export default Card;
