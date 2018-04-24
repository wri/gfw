import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './widget-dynamic-sentence-styles.scss';

class WidgetDynamicSentence extends PureComponent {
  render() {
    const { sentence, className } = this.props;

    return (
      <p
        className={`c-widget-dynamic-sentence ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: sentence }}
      />
    );
  }
}

WidgetDynamicSentence.propTypes = {
  className: PropTypes.string,
  sentence: PropTypes.string
};

export default WidgetDynamicSentence;
