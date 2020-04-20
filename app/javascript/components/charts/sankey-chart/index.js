import React from 'react';
import { PropTypes } from 'prop-types';
import { Tooltip, ResponsiveContainer } from 'recharts';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import OutsideClickHandler from 'react-outside-click-handler';
import Sankey from './sankey-component';
import ChartToolTip from '../components/chart-tooltip';
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
  customLink,
  customNode,
  margin,
  handleMouseOver,
  handleMouseLeave,
  handleOnClick,
  handleOutsideClick
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
          config.nodeTitles.map((t, i) => (
            <span key={`${t}-${i}`} style={{ width: `${nodeWidth}px` }}>
              {t}
            </span>
          ))}
      </div>
      <OutsideClickHandler onOutsideClick={handleOutsideClick}>
        <ResponsiveContainer width="100%" height={height}>
          <Sankey
            width={width}
            data={data}
            className={styles.sankey}
            nodeWidth={nodeWidth}
            nodePadding={nodePadding}
            margin={margin}
            link={
              customLink || (
                <SankeyLink config={{ ...config.link, linkPadding: 1 }} />
              )
            }
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onClick={handleOnClick}
            node={
              customNode || (
                <SankeyNode
                  containerWidth={containerWidth}
                  config={{
                    ...config.node,
                    ...config,
                    nodeWidth
                  }}
                />
              )
            }
          >
            <Tooltip
              content={content => {
                const payloadData =
                  content.payload &&
                  content.payload.length > 0 &&
                  content.payload[0];
                return (
                  !isEmpty(payloadData) && (
                    <ChartToolTip
                      payload={[payloadData.payload]}
                      settings={[
                        {
                          key: payloadData.name,
                          label: `${payloadData.name &&
                            payloadData.name.replace('-', '>')}`
                        },
                        {
                          key: 'value',
                          unit: config.tooltip && config.tooltip.unit,
                          unitFormat: num => format('.2s')(num),
                          label: ''
                        }
                      ]}
                    />
                  )
                );
              }}
            />
          </Sankey>
        </ResponsiveContainer>
      </OutsideClickHandler>
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
  /** Custom link component. Will replace the default */
  customLink: PropTypes.node,
  /** Custom node component. Will replace the default */
  customNode: PropTypes.node,
  /** Function that takes the node info and returns the components to add at the bottom of the tooltip */
  // tooltipChildren: PropTypes.func,
  /** Configuration */
  config: PropTypes.shape({
    /** Configuration for the tooltip */
    tooltip: PropTypes.object,
    /** Configuration for each node */
    node: PropTypes.object,
    /** Configuration for the aspect of the responsive container */
    aspect: PropTypes.number,
    nodeTitles: PropTypes.array,
    link: PropTypes.string
  }),
  /** Set margin of sankey component, used to calculate a position of all child elements inside sankey charts  */
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  handleMouseOver: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  handleOnClick: PropTypes.func,
  handleOutsideClick: PropTypes.func
};

SankeyChart.defaultProps = {
  width: 960,
  height: 500,
  data: {},
  nodeWidth: 140,
  nodePadding: 10,
  containerWidth: 800,
  config: {},
  customLink: null,
  customNode: null,
  margin: { top: 10 }
};

export default SankeyChart;
