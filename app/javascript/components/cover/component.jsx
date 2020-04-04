import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class Cover extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { bgImage, large, className } = this.props;
    const bgStyle = bgImage ? { backgroundImage: `url('${bgImage}'` } : {};
    return (
      <div className={cx('c-cover', { large }, className)} style={bgStyle}>
        <div className="row">
          <div className="columns small-12 medium-8">
            <div className="cover-texts">
              <h1 className="text -title-biggest -color-1">
                {this.props.title}
              </h1>
              <p className="description text -paragraph -color-1">
                {this.props.description}
              </p>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Cover.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  large: PropTypes.bool,
  bgImage: PropTypes.string,
  children: PropTypes.node,
};

export default Cover;
