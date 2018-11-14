import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class LayerMoreInfo extends PureComponent {
  render() {
    const { className, linkUrl, linkText, text } = this.props;

    return (
      <div className={`c-layer-more-info ${className || ''}`}>
        <p>{text}</p>
        <a href={linkUrl} target="_blank" rel="noopener nofollower">
          {linkText}
        </a>
      </div>
    );
  }
}

LayerMoreInfo.propTypes = {
  className: PropTypes.string,
  linkUrl: PropTypes.string,
  linkText: PropTypes.string,
  text: PropTypes.string
};

export default LayerMoreInfo;
