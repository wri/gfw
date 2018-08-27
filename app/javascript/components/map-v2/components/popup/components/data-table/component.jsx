import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class DataTable extends Component {
  render() {
    const { data } = this.props;

    return data ? (
      <div className="c-data-table">
        {data.map(d => (
          <div key={d.label} className="wrapper">
            <div className="label">{d.label}:</div>
            <div className="value">{d.value || 'n/a'}</div>
          </div>
        ))}
      </div>
    ) : null;
  }
}

DataTable.propTypes = {
  data: PropTypes.array
};

export default DataTable;
