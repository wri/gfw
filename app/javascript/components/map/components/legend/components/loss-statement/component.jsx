import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import './styles.scss';

class LossStatement extends PureComponent {
  render() {
    const { className } = this.props;

    return (
      <Tooltip
        theme="tip"
        arrow
        hideOnClick
        html={
          <Tip text="Loss of tree cover may occur for many reasons, including deforestation, fire, and logging within the course of sustainable forestry operations. In sustainably managed forests, the “loss” will eventually show up as “gain”, as young trees get large enough to achieve canopy closure." />
        }
        position="top"
        followCursor
      >
        <div className={`c-loss-statement ${className || ''}`}>
          Tree cover loss <span>is not always deforestation.</span>
        </div>
      </Tooltip>
    );
  }
}

LossStatement.propTypes = {
  className: PropTypes.string
};

export default LossStatement;
