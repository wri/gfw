import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { translateText } from 'utils/lang';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

class DynamicSentence extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    testId: PropTypes.string,
    sentence: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    handleMouseOver: PropTypes.func,
    handleMouseOut: PropTypes.func,
  };

  reduceSentence = (sentence, pattern, component) => {
    const split = sentence.split(pattern);
    return [split[0], component, split[1]];
  };

  render() {
    const { className, testId, handleMouseOver, handleMouseOut } = this.props;
    const sentence = this.props.sentence?.sentence;
    const params = this.props.sentence?.params;
    const { component } = params || {};
    const sentenceParams = {
      ...(params && params),
      ...(!params?.location && { ...params, location: 'selected area' }),
    };
    let formattedSentence = translateText(sentence);
    if (params) {
      Object.keys(sentenceParams).forEach((p) => {
        const param = sentenceParams[p];
        if (param && p !== 'component') {
          if (typeof param === 'object') {
            if (param.color) {
              // eslint-disable-next-line security/detect-non-literal-regexp
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
            // eslint-disable-next-line security/detect-non-literal-regexp
            const DYNAMIC_PARAMETERS = new RegExp(`{${p}}`, 'g');
            const PLACEHOLDER = new RegExp(`\\bPLACEHOLDER\\b`, 'g'); // regex to remove the bold from the word 'and' between indicators

            formattedSentence =
              formattedSentence &&
              formattedSentence
                .replace(DYNAMIC_PARAMETERS, `<b>${translateText(param)}</b>`)
                .replace(PLACEHOLDER, `<span class="no-bold">and</span>`);
          }
        }
      });
    }

    formattedSentence = [formattedSentence?.replace('{area}', 'selected area')];
    if (component) {
      const mappedComponent = {
        ...component,
        pattern: `{${component.key}}`,
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
      <div
        data-test={!!testId && testId}
        className={`c-dynamic-sentence notranslate ${className || ''}`}
      >
        {formattedSentence.map((s) =>
          typeof s === 'string' ? ReactHtmlParser(s) : s
        )}
      </div>
    );
  }
}

export default DynamicSentence;
