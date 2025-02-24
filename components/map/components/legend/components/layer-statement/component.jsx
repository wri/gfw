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

    let statementTitle = statementPlain;
    let statementDesc = statementHighlight;
    let tooltip = tooltipDesc;

    // TODO: how to refactor this? where to put it
    if (
      [
        'Indigenous and Community Lands (Polygons)',
        'Indigenous and Community Lands (Points)',
      ].includes(this.props.activeLayer?.name)
    ) {
      statementTitle =
        'Note that the absence of data does not indicate the absence of Indigenous or Community land.';
      statementDesc = '';
      tooltip = undefined;
    }

    return tooltip ? (
      <Tooltip
        theme="tip"
        hideOnClick
        html={<Tip text={tooltipDesc} className={tooltipClassname} />}
        position="top"
        followCursor
        animateFill={false}
      >
        <div className={cx('c-layer-statement', className)}>
          {statementTitle}
          <span>{statementDesc}</span>
        </div>
      </Tooltip>
    ) : (
      <div className={cx('c-layer-statement', className)}>{statementTitle}</div>
    );
  }
}

LayerStatement.propTypes = {
  className: PropTypes.string,
  tooltipClassname: PropTypes.string,
  statementPlain: PropTypes.string,
  statementHighlight: PropTypes.string,
  tooltipDesc: PropTypes.string,
  activeLayer: PropTypes.object,
};

export default LayerStatement;
