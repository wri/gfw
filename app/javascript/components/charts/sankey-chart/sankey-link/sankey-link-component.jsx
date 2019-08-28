import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

import './sankey-link-styles.scss';

class SankeyLink extends PureComponent {
  constructor() {
    super();
    this.minLinkWidth = 2;
  }

  render() {
    const {
      sourceX,
      sourceY,
      sourceControlX,
      targetX,
      targetY,
      targetControlX,
      linkWidth,
      config,
      payload
    } = this.props;
    const updatedLinkWidth =
      linkWidth < this.minLinkWidth ? this.minLinkWidth : linkWidth;
    const linkStart = config.linkPadding || 140;
    return (
      <path
        className="c-sankey-link"
        d={`
          M${sourceX + linkStart},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX -
          linkStart},${targetY}
        `}
        fill="none"
        stroke={config.highlight && config.highlight(payload) ? '#444' : '#ddd'}
        strokeWidth={updatedLinkWidth}
        strokeOpacity="0.4"
      />
    );
  }
}

SankeyLink.propTypes = {
  sourceX: PropTypes.number,
  targetX: PropTypes.number,
  sourceY: PropTypes.number,
  targetY: PropTypes.number,
  sourceControlX: PropTypes.number,
  targetControlX: PropTypes.number,
  linkWidth: PropTypes.number,
  config: PropTypes.object,
  payload: PropTypes.object
};

SankeyLink.defaultProps = {
  sourceX: null,
  targetX: null,
  sourceY: null,
  targetY: null,
  sourceControlX: null,
  targetControlX: null,
  linkWidth: null,
  config: null
};

export default SankeyLink;
