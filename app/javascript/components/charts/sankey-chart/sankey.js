import React from 'react';
import { PropTypes } from 'prop-types';
import { Tooltip, ResponsiveContainer } from 'recharts';
import Sankey from './sankey-component';
import SankeyTooltip from './sankey-tooltip';
import SankeyLink from './sankey-link';
import SankeyNode from './sankey-node';
import styles from './sankey-styles.scss';

function SankeyChart({
  width,
  height,
  nodeWidth,
  nodePadding,
  containerWidth,
  data,
  config,
  customTooltip,
  customLink,
  customNode,
  tooltipChildren,
  margin
}) {
  return (
    <div className="c-sankey-chart" style={{ height, minWidth: '100%' }}>
      <div
        className="node-titles"
        style={{
          paddingLeft: margin.left || 0,
          paddingRight: margin.right || 0
        }}
      >
        {config.nodeTitles &&
          config.nodeTitles.map(t => <span key={t}>{t}</span>)}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <Sankey
          width={width}
          data={data}
          className={styles.sankey}
          nodeWidth={nodeWidth}
          nodePadding={nodePadding}
          margin={margin}
          link={
            customLink || <SankeyLink config={{ linkPadding: nodeWidth }} />
          }
          node={
            customNode || (
              <SankeyNode
                containerWidth={containerWidth}
                config={{
                  ...config.node,
                  titlePadding: config.titlePadding,
                  nodeWidth
                }}
              />
            )
          }
        >
          {customTooltip || (
            <Tooltip
              content={content => (
                <SankeyTooltip
                  content={content}
                  config={config.tooltip}
                  tooltipChildren={tooltipChildren}
                />
              )}
            />
          )}
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}

SankeyChart.propTypes = {
  /** Width of the chart */
  width: PropTypes.number,
  /** Height of the chart */
  height: PropTypes.number,
  /** Data of the chart */
  data: PropTypes.shape({ nodes: PropTypes.array, links: PropTypes.array }),
  /** Width of every node */
  nodeWidth: PropTypes.number,
  /** Padding of every node */
  nodePadding: PropTypes.number,
  /** Width of the sankey container */
  containerWidth: PropTypes.number,
  /** Custom tooltip component. Will replace the default */
  customTooltip: PropTypes.node,
  /** Custom link component. Will replace the default */
  customLink: PropTypes.node,
  /** Custom node component. Will replace the default */
  customNode: PropTypes.node,
  /** Function that takes the node info and returns the components to add at the bottom of the tooltip */
  tooltipChildren: PropTypes.func,
  /** Configuration */
  config: PropTypes.shape({
    /** Configuration for the tooltip */
    tooltip: PropTypes.object,
    /** Configuration for each node */
    node: PropTypes.object,
    /** Configuration for the aspect of the responsive container */
    aspect: PropTypes.number
  }),
  /** Set margin of sankey component, used to calculate a position of all child elements inside sankey charts  */
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  })
};

SankeyChart.defaultProps = {
  width: 960,
  height: 500,
  data: {},
  nodeWidth: 140,
  nodePadding: 10,
  containerWidth: 800,
  config: {},
  customTooltip: null,
  customLink: null,
  customNode: null,
  tooltipChildren: null,
  margin: { top: 10 }
};

export default SankeyChart;
