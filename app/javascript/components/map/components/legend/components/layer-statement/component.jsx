import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import './styles.scss';

class LayerStatement extends PureComponent {
  render() {
    const {
      className,
      statementPlain,
      statementHighlight,
      tooltipDesc
    } = this.props;

    return (
      <Tooltip
        theme="tip"
        hideOnClick
        html={<Tip text={tooltipDesc} />}
        position="top"
        followCursor
      >
        <div className={`c-layer-statement ${className || ''}`}>
          {statementPlain} <span>{statementHighlight}</span>
        </div>
      </Tooltip>
    );
  }
}

LayerStatement.propTypes = {
  className: PropTypes.string,
  statementPlain: PropTypes.string,
  statementHighlight: PropTypes.string,
  tooltipDesc: PropTypes.string
};

export default LayerStatement;
