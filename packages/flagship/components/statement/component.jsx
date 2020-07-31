import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import './styles.scss';

class Statement extends PureComponent {
  render() {
    const {
      className,
      statementPlain,
      statementHighlight,
      tooltipDesc,
      followCursor,
      handleMouseOver,
      handleMouseOut
    } = this.props;

    return (
      <Tooltip
        theme="tip"
        hideOnClick
        html={<Tip text={tooltipDesc} />}
        position="top"
        followCursor={followCursor}
        animateFill={false}
        onShown={handleMouseOver}
        onHidden={handleMouseOut}
      >
        <div className={`c-layer-statement ${className || ''}`}>
          {statementPlain} <span>{statementHighlight}</span>
        </div>
      </Tooltip>
    );
  }
}

Statement.defaultProps = {
  followCursor: true
};

Statement.propTypes = {
  className: PropTypes.string,
  statementPlain: PropTypes.string,
  statementHighlight: PropTypes.string,
  tooltipDesc: PropTypes.string,
  followCursor: PropTypes.bool,
  handleMouseOver: PropTypes.func,
  handleMouseOut: PropTypes.func
};

export default Statement;
