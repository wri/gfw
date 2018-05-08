import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button';
import Dotdotdot from 'react-dotdotdot';

import './card-styles.scss';

class Card extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className, data, onClick } = this.props;

    return (
      <div className={`c-card ${className || ''}`}>
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
          {data.extLink && (
            <Button className="read-more" extLink={data.extLink}>
              READ MORE
            </Button>
          )}
          {data.link && (
            <Button className="read-more" extLink={data.link}>
              READ MORE
            </Button>
          )}
          {onClick && (
            <Button className="read-more" onClick={onClick}>
              READ MORE
            </Button>
          )}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Card;
