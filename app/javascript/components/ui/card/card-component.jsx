import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button/button-component';
import Dotdotdot from 'react-dotdotdot';

import './card-styles.scss';
import './themes/card-small.scss';

class Card extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className, theme, data } = this.props;
    const { image, imageCredit, title, summary, meta, buttons } = data || {};

    return (
      <div className={`c-card ${className || ''} ${theme || ''}`}>
        {image && (
          <div className="image" style={{ backgroundImage: `url(${image})` }} />
        )}
        <div className="body">
          {imageCredit && <span>{imageCredit}</span>}
          {title && <h3 className="title">{title}</h3>}
          {summary && (
            <div className="summary">
              <Dotdotdot clamp={4}>{summary}</Dotdotdot>
            </div>
          )}
          {meta && <p className="meta">{meta}</p>}
          {buttons && (
            <div className="buttons">
              {buttons.map((button, i) => (
                <Button key={`card-button-${i}`} {...button}>
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
  onClick: PropTypes.func
};

export default Card;
