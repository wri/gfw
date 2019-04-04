import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';

class PromptTooltip extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      closeProps,
      backProps,
      step: { title, content, link },
      primaryProps,
      isLastStep,
      index,
      numOfSteps
    } = this.props;

    return (
      <div className="c-prompt-tooltip">
        <button className="prompt-close" {...closeProps}>
          <Icon icon={closeIcon} />
        </button>
        <div className="step-title">
          {`${title} · ${index + 1}/${numOfSteps}`}
        </div>
        <div className="step-content">{content}</div>
        <div className="step-btns">
          {index !== 0 && (
            <Button theme="theme-button-light" {...backProps}>
              BACK
            </Button>
          )}
          {isLastStep ? (
            <Button {...closeProps}>CLOSE</Button>
          ) : (
            <Button {...primaryProps}>NEXT</Button>
          )}
        </div>
        {link && (
          <Button theme="theme-button-small" extLink={link}>
            learn how
          </Button>
        )}
      </div>
    );
  }
}

PromptTooltip.propTypes = {
  closeProps: PropTypes.object,
  backProps: PropTypes.object,
  step: PropTypes.string,
  primaryProps: PropTypes.object,
  isLastStep: PropTypes.bool,
  index: PropTypes.number,
  numOfSteps: PropTypes.number
};

export default PromptTooltip;
