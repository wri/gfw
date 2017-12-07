import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './cover-styles.scss';

class Cover extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { bgImage } = this.props;
    const bgStyle = bgImage ? { backgroundImage: `url('${bgImage}'` } : {};
    return (
      <div className="c-cover" style={bgStyle}>
        <div className="row">
          <div className="small-12 columns">
            <div className="cover-texts">
              <h1 className="text -title-biggest -color-1">
                {this.props.title}
              </h1>
              <p className="description text -paragraph -color-1">
                {this.props.description}
              </p>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Cover.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bgImage: PropTypes.string,
  children: PropTypes.node
};

export default Cover;
