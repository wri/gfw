import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import './dynamic-sentence-styles.scss';

class WidgetDynamicSentence extends PureComponent {
  reduceSentence = (sentence, pattern, component) => {
    const split = sentence.split(pattern);
    return [split[0], component, split[1]];
  };

  render() {
    const { className, handleMouseOver, handleMouseOut } = this.props;
    const { sentence, params } = this.props.sentence;
    const { component } = params || {};
    let formattedSentence = sentence;
    if (params) {
      Object.keys(params).forEach(p => {
        const param = params[p];
        if (param && p !== 'component') {
          if (typeof param === 'object') {
            if (param.color) {
              formattedSentence =
                formattedSentence &&
                formattedSentence.replace(
                  `{${p}}`,
                  `<b class="notranslate" style="color: ${param.color};">${
                    param.value
                  }</b>`
                );
            }
          } else {
            formattedSentence =
              formattedSentence &&
              formattedSentence.replace(
                `{${p}}`,
                `<b class="notranslate">${param}</b>`
              );
          }
        }
      });
    }

    formattedSentence = [formattedSentence];
    if (component) {
      const mappedComponent = {
        ...component,
        pattern: `{${component.key}}`
      };
      formattedSentence = this.reduceSentence(
        formattedSentence[0],
        mappedComponent.pattern,
        <Tooltip
          key={mappedComponent}
          theme="tip"
          hideOnClick
          html={<Tip text={mappedComponent.tooltip} />}
          position="top"
          followCursor
          animateFill={false}
          onShown={handleMouseOver}
          onHidden={handleMouseOut}
          duration={0}
        >
          <span className="hover-text">{mappedComponent.key}</span>
        </Tooltip>
      );
    }

    return (
      <div className={`c-dynamic-sentence ${className || ''}`}>
        {formattedSentence.map(
          s => (typeof s === 'string' ? ReactHtmlParser(s) : s)
        )}
      </div>
    );
  }
}

WidgetDynamicSentence.propTypes = {
  className: PropTypes.string,
  sentence: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  handleMouseOver: PropTypes.func,
  handleMouseOut: PropTypes.func
};

export default WidgetDynamicSentence;
