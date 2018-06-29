import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button';
import Dotdotdot from 'react-dotdotdot';

import './card-styles.scss';
import './themes/card-small.scss';

class Card extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className, theme, data, buttons } = this.props;

    return (
      <div className={`c-card ${className || ''} ${theme || ''}`}>
        {data.image && (
          <div
            className="image"
            style={{ backgroundImage: `url(${data.image})` }}
          >
            <span>{data.imageCredit}</span>
          </div>
        )}
        <div className="body">
          {data.title && <h3 className="title">{data.title}</h3>}
          {data.summary && (
            <div className="summary">
              <Dotdotdot clamp={4}>{data.summary}</Dotdotdot>
            </div>
          )}
          {data.meta && <p className="meta">{data.meta}</p>}
          <div className="buttons">
            {buttons &&
              buttons.map((button, i) => (
                <Button key={`card-button-${i}`} {...button}>
                  {button.text}
                </Button>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  theme: PropTypes.string,
  buttons: PropTypes.array,
  onClick: PropTypes.func
};

export default Card;
