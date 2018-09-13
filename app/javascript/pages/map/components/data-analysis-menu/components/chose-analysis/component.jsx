import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Dropdown from 'components/ui/dropdown';

import infoIcon from 'assets/icons/info.svg';
import squarePointIcon from 'assets/icons/square-point.svg';
import polygonIcon from 'assets/icons/polygon.svg';
import config from './upload-file-config.json';
import './styles.scss';

class ChoseAnalysis extends PureComponent {
  renderLayerOption = () => {
    const {
      boundaries,
      activeBoundary,
      selectBoundaries,
      setMenuSettings
    } = this.props;
    const selectedBoundaries = activeBoundary || (boundaries && boundaries[0]);
    return (
      <div className="layer">
        <div className="layer-title">One click analysis on:</div>
        <Dropdown
          className="boundary-selector"
          options={boundaries}
          value={selectedBoundaries && selectedBoundaries.value}
          onChange={selectBoundaries}
          native
        />
        <div className="layer-description">
          One-click analysis is also available by default for most data layers
          under the{' '}
          <button
            onClick={() => setMenuSettings({ selectedSection: 'landUse' })}
          >
            Land Use
          </button>{' '}
          and{' '}
          <button
            onClick={() => setMenuSettings({ selectedSection: 'biodiversity' })}
          >
            Biodiversity tabs
          </button>.
        </div>
      </div>
    );
  };

  renderPolygonOption = () => (
    <div className="polygon">
      <div className="polygon-title">
        Draw in the map the area you want to analyze or subscribe to
      </div>
      <Button
        onClick={() => {
          const { setAnalysisData } = this.props;
          setAnalysisData({
            polygon: {
              type: 'Polygon',
              coordinates: [
                [
                  [-7.8772, 40.2166],
                  [-7.2565, 40.1579],
                  [-7.2784, 39.8845],
                  [-7.6135, 39.8507],
                  [-7.8772, 40.2166]
                ]
              ]
            }
          });
        }}
      >
        START DRAWING
      </Button>
      <div className="polygon-separator">or</div>
      <Dropzone onDrop={this.onDrop} className="polygon-input">
        <p>Click to pick a file or drop one here</p>
        <Button className="theme-button-tiny square info-button">
          <Icon icon={infoIcon} className="info-icon" />
        </Button>
      </Dropzone>
    </div>
  );

  onDrop = files => {
    const { uploadShape } = this.props;
    const file = files[0];
    if (file.size > config.sizeLimit && !window.confirm(config.sizeMessage)) {
      return;
    }

    uploadShape(file);
  };

  render() {
    const { showDraw, setAnalysisSettings } = this.props;
    return (
      <div className="c-chose-analysis">
        <div className="title">ANALYZE AND TRACK FOREST CHANGE</div>
        <div className="options">
          <button
            className={cx({ selected: !showDraw })}
            onClick={() => setAnalysisSettings({ showDraw: false })}
          >
            <Icon icon={squarePointIcon} className="icon-square-point" />
            <div className="label">CLICK A LAYER ON THE MAP</div>
          </button>
          <button
            className={cx({ selected: showDraw })}
            onClick={() => setAnalysisSettings({ showDraw: true })}
          >
            <Icon icon={polygonIcon} className="icon-polygon" />
            <div className="label">DRAW OR UPLOAD SHAPE</div>
          </button>
        </div>
        {showDraw ? this.renderPolygonOption() : this.renderLayerOption()}
      </div>
    );
  }
}

ChoseAnalysis.propTypes = {
  showDraw: PropTypes.bool,
  setAnalysisSettings: PropTypes.func,
  uploadShape: PropTypes.func,
  setAnalysisData: PropTypes.func,
  boundaries: PropTypes.array,
  activeBoundary: PropTypes.object,
  selectBoundaries: PropTypes.func,
  setMenuSettings: PropTypes.func
};

export default ChoseAnalysis;
