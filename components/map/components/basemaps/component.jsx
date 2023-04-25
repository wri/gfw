import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class LegendBasemaps extends PureComponent {
  render() {
    const { className } = this.props;

    return (
      <div className={`c-legend-basemaps ${className || ''}`}>
        <div className="title">Satellite imagery</div>
        such basemaps
      </div>
    );
  }
}

LegendBasemaps.propTypes = {
  className: PropTypes.string,
};

export default LegendBasemaps;
