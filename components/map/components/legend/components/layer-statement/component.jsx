import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import cx from 'classnames';

class LayerStatement extends PureComponent {
  render() {
    const {
      className,
      tooltipClassname,
      statementPlain,
      statementHighlight,
      tooltipDesc,
    } = this.props;

    return tooltipDesc ? (
      <Tooltip
        theme="tip"
        hideOnClick
        html={<Tip text={tooltipDesc} className={tooltipClassname} />}
        position="top"
        animateFill={false}
      >
        <div className={cx('c-layer-statement', className)}>
          {statementPlain}
          <span>{statementHighlight}</span>
        </div>
      </Tooltip>
    ) : (
      <div className={cx('c-layer-statement', className)}>{statementPlain}</div>
    );
  }
}

LayerStatement.propTypes = {
  className: PropTypes.string,
  tooltipClassname: PropTypes.string,
  statementPlain: PropTypes.string,
  statementHighlight: PropTypes.string,
  tooltipDesc: PropTypes.string,
};

export default LayerStatement;
