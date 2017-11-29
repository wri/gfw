import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './loader-styles.scss';

class Loader extends PureComponent {
  render() {
    const { parentClass, isAbsolute } = this.props;

    const loader = (
      <div className={`c-loader ${isAbsolute ? 'c-loader--absolute' : ''}`}>
        <div className="c-loader__spinner" />
      </div>
    );

    return parentClass ? <div className={parentClass}>{loader}</div> : loader;
  }
}

Loader.propTypes = {
  parentClass: PropTypes.string,
  isAbsolute: PropTypes.bool
};

export default Loader;
