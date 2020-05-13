import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { translateText } from 'utils/transifex';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import './dynamic-sentence-styles.scss';

class DynamicSentence extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    sentence: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    handleMouseOver: PropTypes.func,
    handleMouseOut: PropTypes.func
  };

  reduceSentence = (sentence, pattern, component) => {
    const split = sentence.split(pattern);
    return [split[0], component, split[1]];
  };

  render() {
    const { className, handleMouseOver, handleMouseOut } = this.props;
    const { sentence, params } = this.props.sentence;
    const { component } = params || {};
    let formattedSentence = translateText(sentence);
    if (params) {
      Object.keys(params).forEach(p => {
        const param = params[p];
        if (param && p !== 'component') {
          if (typeof param === 'object') {
            if (param.color) {
              const regex = new RegExp(`{${p}}`, 'g');
              formattedSentence =
                formattedSentence &&
                formattedSentence.replace(
                  regex,
                  `<b style="color: ${param.color};">${translateText(
                    param.value
                  )}</b>`
                );
            }
          } else {
            const regex = new RegExp(`{${p}}`, 'g');
            formattedSentence =
              formattedSentence &&
              formattedSentence.replace(
                regex,
                `<b>${translateText(param)}</b>`
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
          <span className={component.fine ? 'hover-text-fine' : 'hover-text'}>
            {translateText(mappedComponent.key)}
          </span>
        </Tooltip>
      );
    }

    return (
      <div className={`c-dynamic-sentence notranslate ${className || ''}`}>
        {formattedSentence.map(
          s => (typeof s === 'string' ? ReactHtmlParser(s) : s)
        )}
      </div>
    );
  }
}

export default DynamicSentence;
