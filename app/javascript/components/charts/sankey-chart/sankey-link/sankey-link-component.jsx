import React from 'react';
import { PropTypes } from 'prop-types';

import './sankey-link-styles.scss';

function SankeyLink({
  sourceX,
  sourceY,
  sourceControlX,
  targetX,
  targetY,
  targetControlX,
  linkWidth,
  config,
  payload
}) {
  const minLinkWidth = 2;
  const updatedLinkWidth = linkWidth < minLinkWidth ? minLinkWidth : linkWidth;
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
