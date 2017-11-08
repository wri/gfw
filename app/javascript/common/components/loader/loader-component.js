import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Loader extends PureComponent {

  render() {
    const {
      parentClass
    } = this.props;

    const loader = (
      <div className="c-loader">
        <div className="c-loader__spinner"></div>
      </div>
    );

    return parentClass ? <div className={parentClass}>{loader}</div> : loader;
  }
}

Loader.propTypes = {
  parentClass: PropTypes.string
};

export default Loader;
