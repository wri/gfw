import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import Dotdotdot from 'react-dotdotdot';

import './card-styles.scss';

class Card extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, readMoreText, className, target } = this.props;
    const onClick = this.props.onClick || false;
    return (
      <div className={`c-card ${className}`}>
        {data.image && (
          <div
            className={`image ${onClick ? '-action' : ''}`}
            style={{ backgroundImage: `url(${data.image})` }}
            onClick={() => onClick && onClick(data)}
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
            <Button className="card-button" extLink={data.link} target={target}>
              {readMoreText}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.string.isRequired,
    image_credit: PropTypes.string,
    title: PropTypes.string,
    outcome: PropTypes.string,
    link: PropTypes.string,
    legend: PropTypes.string
  }),
  className: PropTypes.string,
  onClick: PropTypes.func,
  readMoreText: PropTypes.string.isRequired,
  target: PropTypes.string
};

Card.defaultProps = {
  readMoreText: 'READ MORE'
};

export default Card;
