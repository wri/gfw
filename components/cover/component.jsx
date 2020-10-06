import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class Cover extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      bgImage,
      large,
      className,
      title,
      description,
      children,
    } = this.props;
    const bgStyle = bgImage ? { backgroundImage: `url('${bgImage}'` } : {};

    return (
      <div className={cx('c-cover', { large }, className)} style={bgStyle}>
        <div className="row">
          <div className="columns small-12 medium-8">
            <div className="cover-texts">
              <h1 className="text -title-biggest -color-1">{title}</h1>
              {Array.isArray(description) ? (
                <div>{description}</div>
              ) : (
                <p>{description}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Cover.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  large: PropTypes.bool,
  bgImage: PropTypes.string,
  children: PropTypes.node,
};

export default Cover;
