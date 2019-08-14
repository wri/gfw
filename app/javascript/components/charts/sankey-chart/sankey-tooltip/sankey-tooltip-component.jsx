import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import styles from './sankey-tooltip-styles.scss';

class SankeyTooltip extends PureComponent {
  render() {
    const { config, content, tooltipChildren } = this.props;
    const suffix = config.suffix ? ` ${config.suffix}` : '';
    const scale = config.scale || 1;
    const valueFormat = config.format || 'n';
    return (
      <div className={styles.tooltip}>
        {content &&
          content.payload &&
          content.payload.length > 0 &&
          content.payload.map(
            node =>
              (node.payload ? (
                <div key={node.name}>
                  <div className={styles.tooltipHeader}>
                    <span className={styles.targetName}>
                      {node.payload.payload &&
                        node.payload.payload.target &&
                        `${node.payload.payload.target.name} 
                           ${
                node.payload.payload.timeframes
                  ? node.payload.payload.timeframes
                  : ''
                }`}
                    </span>
                    {config.unit && (
                      <span className={styles.unit}>{config.unit}</span>
                    )}
                  </div>
                  <div className={styles.label}>
                    <div className={styles.legend}>
                      <span
                        className={styles.labelDot}
                        style={
                          node.payload.payload && {
                            backgroundColor: node.payload.payload.source
                              ? node.payload.payload.source.color
                              : node.payload.payload.color
                          }
                        }
                      />
                      <div className={styles.labelName}>
                        {node.payload.payload && node.payload.payload.source
                          ? node.payload.payload.source.name
                          : node.payload.payload && node.payload.payload.name}
                      </div>
                    </div>
                    <div className={styles.labelValue}>
                      {`${format(valueFormat)(node.value * scale)}${suffix}`}
                    </div>
                  </div>
                  <div className={styles.tooltipChildren}>
                    {tooltipChildren && tooltipChildren(node)}
                  </div>
                </div>
              ) : null)
          )}
        {content && !content.payload && <div>No data</div>}
      </div>
    );
  }
}

SankeyTooltip.propTypes = {
  content: PropTypes.shape({
    payload: PropTypes.array
  }),
  config: PropTypes.shape({
    unit: PropTypes.string
  }),
  tooltipChildren: PropTypes.func
};

SankeyTooltip.defaultProps = {
  content: null,
  config: {},
  tooltipChildren: null
};

export default SankeyTooltip;
