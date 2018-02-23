import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import Dotdotdot from 'react-dotdotdot';

import './card-styles.scss';

class Card extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className, data, readMoreText, onClick } = this.props;
    return (
      <div className={`c-card ${className}`}>
        {data.image && (
          <div
            className={`image ${onClick ? '-action' : ''}`}
            style={{ backgroundImage: `url(${data.image})` }}
            onClick={onClick}
            role="button"
            tabIndex={0}
          >
            <span>{data.image_credit}</span>
          </div>
        )}
        <div className="body">
          {data.title && (
            <h3 className="header text -title-m -color-2 -light">
              {data.title}
            </h3>
          )}
          {data.outcome && (
            <div className="paragraph text -paragraph-7 -color-2">
              <Dotdotdot clamp={4}>{data.outcome}</Dotdotdot>
            </div>
          )}
          {data.legend && (
            <p className="meta text -paragraph-5 -color-2-o ">{data.legend}</p>
          )}
          {data.link && (
            <Button className="card-button" extLink={data.link}>
              {readMoreText}
            </Button>
          )}
          {data.extLink && (
            <Button className="card-button" extLink={data.extLink}>
              {readMoreText}
            </Button>
          )}
          {onClick && (
            <Button className="card-button" onClick={onClick}>
              {readMoreText}
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
  onClick: PropTypes.func,
  readMoreText: PropTypes.string.isRequired
};

Card.defaultProps = {
  readMoreText: 'READ MORE'
};

export default Card;
