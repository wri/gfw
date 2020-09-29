import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';

import './styles.scss';

const DataTable = ({ data }) => (
  <div className="c-data-table">
    {data?.map((d) => (
      <div key={`${d.label}-${d?.value}`} className="wrapper">
        <div className="label">
          {d?.label}
          :
        </div>
        <div className="value">
          {d.type === 'number'
            ? formatNumber({ num: d.value, unit: d.suffix })
            : d.value || 'n/a'}
        </div>
      </div>
    ))}
  </div>
);

DataTable.propTypes = {
  data: PropTypes.array,
};

export default DataTable;
