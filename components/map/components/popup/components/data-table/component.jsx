import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import bbox from 'turf-bbox';

import Button from 'components/ui/button';

import './styles.scss';

const DataTable = ({
  data,
  zoomToShape,
  onAnalyze,
  onClose,
  isPoint,
  setMapSettings,
  setAnalysisSettings,
  setMainMapSettings,
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
    {isPoint && (
      <Button
        onClick={() => {
          setMapSettings({ drawing: true });
          setAnalysisSettings({ showDraw: true });
          setMainMapSettings({ showAnalysis: true });
        }}
      >
        draw a shape to analyze
      </Button>
    )}
    {!isPoint && zoomToShape && (
      <Button
        onClick={() => {
          const newBbox = data && bbox(data?.geometry);
          setMapSettings({ canBound: true, bbox: newBbox });
          onClose();
        }}
      >
        Zoom
      </Button>
    )}
    {!isPoint && !zoomToShape && <Button onClick={onAnalyze}>analyze</Button>}
  </div>
);

DataTable.propTypes = {
  data: PropTypes.array,
  zoomToShape: PropTypes.bool,
  isPoint: PropTypes.bool,
  onClose: PropTypes.func,
  onAnalyze: PropTypes.func,
  setMapSettings: PropTypes.func,
  setAnalysisSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
};

export default DataTable;
