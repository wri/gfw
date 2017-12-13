import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './widget-dynamic-sentence-styles.scss';

class WidgetDynamicSentence extends PureComponent {
  render() {
    const { sentence } = this.props;

    return (
      <p
        className="c-widget-dynamic-sentence"
        dangerouslySetInnerHTML={{ __html: sentence }}
      />
    );
  }
}

WidgetDynamicSentence.propTypes = {
  sentence: PropTypes.string.isRequired
};

export default WidgetDynamicSentence;
