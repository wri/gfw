import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Dropdown from 'components/ui/dropdown';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import infoIcon from 'assets/icons/info.svg';
import squarePointIcon from 'assets/icons/square-point.svg';
import polygonIcon from 'assets/icons/polygon.svg';

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
      <div className="layer-menu">
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
    <div className="draw-menu">
      <div className="draw-menu-title">
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
      <div className="draw-menu-separator">or</div>
      <Tooltip
        theme="tip"
        hideOnClick
        html={<Tip text={this.props.errorMessage} />}
        position="top"
        followCursor
        animateFill={false}
        disabled={!this.props.error || !this.props.errorMessage}
      >
        <Dropzone
          className={cx(
            'draw-menu-input',
            { error: this.props.error },
            { 'error-message': this.props.errorMessage }
          )}
          onDrop={this.props.onDrop}
          accept={this.props.uploadConfig.types}
          multiple={false}
        >
          <p>{this.props.error || 'Pick a file or drop one here'}</p>
          <Button
            className="info-button"
            theme="theme-button-tiny square"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              this.props.setModalSources({ open: true, source: 'uploads' });
            }}
          >
            <Icon icon={infoIcon} className="info-icon" />
          </Button>
        </Dropzone>
      </Tooltip>
      <p className="terms">
        By uploading data you agree to the{' '}
        <a href="/terms" target="_blank" rel="noopenner nofollower">
          GFW Terms of Service
        </a>
      </p>
    </div>
  );

  render() {
    const { showDraw, setAnalysisSettings, clearAnalysisError } = this.props;
    return (
      <div className="c-chose-analysis">
        <div className="title">ANALYZE AND TRACK FOREST CHANGE</div>
        <div className="options">
          <button
            className={cx({ selected: !showDraw })}
            onClick={() => {
              setAnalysisSettings({ showDraw: false });
              clearAnalysisError();
            }}
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
  onDrop: PropTypes.func,
  setAnalysisData: PropTypes.func,
  clearAnalysisError: PropTypes.func,
  boundaries: PropTypes.array,
  activeBoundary: PropTypes.object,
  selectBoundaries: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setModalSources: PropTypes.func,
  error: PropTypes.string,
  errorMessage: PropTypes.string,
  uploadConfig: PropTypes.object
};

export default ChoseAnalysis;
