import React from 'react';
import { Rectangle, Layer } from 'recharts';
import { PropTypes } from 'prop-types';
import { splitSVGText } from 'utils/strings';
import './sankey-node-styles.scss';

function SankeyNode({ x, y, height, index, payload, config }) {
  const width = 140;
  const isEndNode = x > width;
  const padding = config.padding || 10;
  const rectangleStart = config.titlePadding || 140;
  const minHeight = 3;

  const tSpans = text => {
    const fontSize = config.fontSize || 13;
    const lineHeight = config.lineHeigth || 1.2;
    const textHeight = config.textHeight || 20;
    const tspanLineHeight = config.tspanLineHeight || 10;
    const startX = isEndNode
      ? x - width - padding // right text
      : x + width + padding + 10; // left text, +10px to compensate the gap (see L55)
    const startY = y + height / 2 - fontSize || 0;
    const charactersPerLine = rectangleStart / 6 - 3; // -3 for the ellipsis
    const maxLines = 2;
    const svgTexts = splitSVGText(
      text,
      textHeight,
      tspanLineHeight,
      charactersPerLine,
      maxLines
    );
    return svgTexts
      .map(
        (t, i) =>
          `<tspan
        x="${startX}"
        y="${startY +
          fontSize * lineHeight +
          i * fontSize * lineHeight -
          0.5 * (svgTexts.length - 1) * fontSize}"
      >
        ${t}
      </tspan>`
      )
      .join('\n');
  };

  return (
    payload &&
    payload.value && (
      <Layer key={`CustomNode${index}`}>
        <Rectangle
          x={isEndNode ? x - width : x} // negative direction
          y={y - 1} // fixes svg border
          width={isEndNode ? width : width + 10} // start nodes have a 10px gap ??
          height={height < minHeight ? minHeight : height + 2} // adds 2px to compensate the -1px dy
          fill={payload.color}
          fillOpacity="1"
        />
        <text
          textAnchor={isEndNode ? 'end' : 'start'}
          className="sankey-node-text"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: tSpans(payload.name) }}
        />
      </Layer>
    )
  );
}

SankeyNode.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  index: PropTypes.number,
  payload: PropTypes.shape({
    color: PropTypes.string,
    depth: PropTypes.number,
    dx: PropTypes.number,
    dy: PropTypes.number,
    name: PropTypes.string,
    SourceLinks: PropTypes.array,
    SourceNodes: PropTypes.array,
    targetLinks: PropTypes.array,
    targetNodes: PropTypes.array,
    value: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }),
  config: PropTypes.shape({
    unit: PropTypes.string,
    suffix: PropTypes.string,
    // Padding for the titles, before and after the chart
    titlePadding: PropTypes.number
  })
};

SankeyNode.defaultProps = {
  x: 0,
  y: 0,
  width: 20,
  height: 20,
  index: 0,
  payload: {},
  config: {}
};

export default SankeyNode;
