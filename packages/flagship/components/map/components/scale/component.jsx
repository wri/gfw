import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class MapScale extends PureComponent {
  render() {
    const { scales: { imperial, metric }, className } = this.props;

    return (
      <div className={cx('c-map-scale', className)}>
        {imperial && (
          <span
            className="scale imperial-scale"
            style={{
              width: imperial.width
            }}
          >
            {imperial.scale}
          </span>
        )}
        {metric && (
          <span
            className="scale metric-scale"
            style={{
              width: metric.width
            }}
          >
            {metric.scale}
          </span>
        )}
      </div>
    );
  }
}

MapScale.propTypes = {
  scales: PropTypes.object,
  className: PropTypes.string
};

export default MapScale;
