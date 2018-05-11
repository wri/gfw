import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './dynamic-sentence-styles.scss';

class WidgetDynamicSentence extends PureComponent {
  render() {
    const { className } = this.props;
    const { sentence, params } = this.props.sentence;
    let formattedSentence = sentence;
    if (params) {
      Object.keys(params).forEach(p => {
        formattedSentence = formattedSentence.replace(
          `{${p}}`,
          `<b ${
            typeof params[p] === 'object' && params[p] && params[p].color
              ? `style="color: ${params[p].color};`
              : ''
          }">${(typeof params[p] === 'object' &&
            params[p] &&
            params[p].value) ||
            params[p]}</b>`
        );
      });
    }

    return (
      <p
        className={`c-dynamic-sentence ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: formattedSentence }}
      />
    );
  }
}

WidgetDynamicSentence.propTypes = {
  className: PropTypes.string,
  sentence: PropTypes.object
};

export default WidgetDynamicSentence;
