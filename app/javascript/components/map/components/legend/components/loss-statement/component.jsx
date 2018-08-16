import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import helpIcon from 'assets/images/help.png';

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
          <Tip text="In this data set, “tree cover” is defined as all vegetation greater than 5 meters in height, and may take the form of natural forests or plantations across a range of canopy densities. “Loss” indicates the removal or mortality of tree cover and can be due to a variety of factors, including mechanical harvesting, fire, disease, or storm damage. As such, “loss” does not equate to deforestation." />
        }
        position="top"
        followCursor
      >
        <div
          className={`c-loss-statement ${className || ''}`}
          style={{ cursor: `url(${helpIcon}), auto` }}
        >
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
