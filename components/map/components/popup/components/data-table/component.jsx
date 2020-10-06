import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import bbox from 'turf-bbox';

import Button from 'components/ui/button';

import './styles.scss';

const DataTable = ({
  data,
  zoomToShape,
  setMapSettings,
  onAnalyze,
  onClose,
}) => (
  <div className="c-data-table">
    <div className="table">
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
    {zoomToShape ? (
      <Button
        onClick={() => {
          const newBbox = bbox(data?.geometry);
          setMapSettings({ canBound: true, bbox: newBbox });
          onClose();
        }}
      >
        Zoom
      </Button>
    ) : (
      <Button
        onClick={() => {
          onAnalyze(data);
        }}
      >
        analyze
      </Button>
    )}
  </div>
);

DataTable.propTypes = {
  data: PropTypes.array,
  zoomToShape: PropTypes.func,
  setMapSettings: PropTypes.func,
  onAnalyze: PropTypes.func,
  onClose: PropTypes.func,
};

export default DataTable;
