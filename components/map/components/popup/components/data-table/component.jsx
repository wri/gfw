import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import bbox from 'turf-bbox';

import Button from 'components/ui/button';

import './styles.scss';

const renderString = ({ suffix, type, linkText, value }) => {
  let valueString = value || 'n/a';
  if (type === 'number' && value) {
    valueString = formatNumber({ num: value, unit: suffix });
  } else if (type === 'link' && value && linkText) {
    valueString = (
      <a href={value} alt="Read More" target="_blank" rel="noopener noreferrer">
        {linkText}
      </a>
    );
  }
  return valueString;
};

const DataTable = ({
  data,
  selected,
  zoomToShape,
  onAnalyze,
  onClose,
  isPoint,
  setMapSettings,
  setAnalysisSettings,
  setMainMapSettings,
}) => {
  return (
    <div className="c-data-table">
      <div className="table">
        {data?.map((d) => (
          <div key={`${d.label}-${d?.value}`} className="wrapper">
            <div className="label">
              {d?.label}
              :
            </div>
            <div
              className={d?.type === 'link' && d?.linkText ? 'link' : 'value'}
            >
              {renderString(d)}
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
            const newBbox = selected && bbox(selected?.geometry);
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
};

DataTable.propTypes = {
  data: PropTypes.array,
  selected: PropTypes.object,
  zoomToShape: PropTypes.bool,
  isPoint: PropTypes.bool,
  onClose: PropTypes.func,
  onAnalyze: PropTypes.func,
  setMapSettings: PropTypes.func,
  setAnalysisSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
};

export default DataTable;
