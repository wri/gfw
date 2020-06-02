import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import cx from 'classnames';
import { logEvent } from 'app/analytics';
import { format } from 'd3-format';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Dropdown from 'components/ui/dropdown';

import infoIcon from 'assets/icons/info.svg?sprite';
import closeIcon from 'assets/icons/close.svg?sprite';
import squarePointIcon from 'assets/icons/square-point.svg?sprite';
import polygonIcon from 'assets/icons/polygon.svg?sprite';

import './styles.scss';

class ChoseAnalysis extends PureComponent {
  static propTypes = {
    showDraw: PropTypes.bool,
    setAnalysisSettings: PropTypes.func,
    onDropAccepted: PropTypes.func,
    onDropRejected: PropTypes.func,
    clearAnalysisError: PropTypes.func,
    boundaries: PropTypes.array,
    activeBoundary: PropTypes.object,
    selectBoundaries: PropTypes.func,
    setMenuSettings: PropTypes.func,
    setModalSources: PropTypes.func,
    error: PropTypes.string,
    errorMessage: PropTypes.string,
    uploadConfig: PropTypes.object,
    uploading: PropTypes.bool,
    uploadStatus: PropTypes.number,
    handleCancelUpload: PropTypes.func,
    drawing: PropTypes.bool,
    setMapSettings: PropTypes.func,
    file: PropTypes.object,
  };

  renderLayerOption = () => {
    const {
      boundaries,
      activeBoundary,
      selectBoundaries,
      setMenuSettings,
    } = this.props;
    const selectedBoundaries = activeBoundary || (boundaries && boundaries[0]);

    return (
      <div className="layer-menu">
        <div className="layer-title">One click analysis on shape or:</div>
        <Dropdown
          className="boundary-selector analysis-boundary-menu"
          options={boundaries}
          value={selectedBoundaries && selectedBoundaries.value}
          onChange={selectBoundaries}
          native
        />
        <div className="layer-description">
          One-click analysis is also available by default for most data layers
          under the
          {' '}
          <button
            onClick={() =>
              setMenuSettings({
                menuSection: 'datasets',
                datasetCategory: 'landUse',
              })}
          >
            land use
          </button>
          {' '}
          and
          {' '}
          <button
            onClick={() =>
              setMenuSettings({
                menuSection: 'datasets',
                datasetCategory: 'biodiversity',
              })}
          >
            biodiversity
          </button>
          {' '}
          tabs.
        </div>
      </div>
    );
  };

  renderPolygonOption = () => {
    const {
      drawing,
      setMapSettings,
      setMenuSettings,
      setModalSources,
      errorMessage,
      error,
      onDropAccepted,
      onDropRejected,
      handleCancelUpload,
      uploadConfig,
      uploading,
      uploadStatus,
      file,
    } = this.props;
    const hasError = error && errorMessage;

    return (
      <div className="draw-menu">
        <div className="draw-menu-title">
          Draw in the map the area you want to analyze
        </div>
        <Button
          className="draw-menu-button"
          theme={drawing ? 'theme-button-light wide' : 'wide'}
          onClick={() => {
            setMapSettings({ drawing: !drawing });
            if (!drawing) {
              setMenuSettings({ menuSection: '' });
            }
            logEvent(drawing ? 'analysisDrawCancel' : 'analysisDrawStart');
          }}
        >
          {drawing ? 'CANCEL' : 'START DRAWING'}
        </Button>
        <div className="draw-menu-separator">or</div>
        <Dropzone
          className={cx(
            'draw-menu-input',
            { error: error && errorMessage },
            { uploading }
          )}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
          maxSize={uploadConfig.sizeLimit}
          accept={uploadConfig.types}
          multiple={false}
          disabled={uploading}
        >
          {hasError && !uploading && (
            <Fragment>
              <p className="error-title">{error}</p>
              <p className="small-text error-desc">{errorMessage}</p>
            </Fragment>
          )}
          {!hasError && !uploading && (
            <Fragment>
              <p>
                Drag and drop your
                {' '}
                <b>polygon data file</b>
                {' '}
                or click here to
                upload
              </p>
              <p className="small-text">{'Recommended file size < 1 MB'}</p>
            </Fragment>
          )}
          {!hasError && uploading && (
            <div className="uploading-shape">
              <p className="file-name">{file && file.name}</p>
              <p className="file-size">
                {`Uploading ${(file && format('.2s')(file.size)) || 0}B`}
              </p>
              <div className="upload-bar">
                <div className="loading-bar">
                  <span className="full-bar" />
                  <span
                    className="status-bar"
                    style={{ width: `${uploadStatus || 0}%` }}
                  />
                </div>
                <Button
                  theme="theme-button-clear"
                  className="cancel-upload-btn"
                  onClick={handleCancelUpload}
                >
                  <Icon className="cancel-upload-icon" icon={closeIcon} />
                </Button>
              </div>
            </div>
          )}
        </Dropzone>
        <div className="terms">
          <div className="first-term">
            <p>Learn more about supported file formats</p>
            <Button
              className="info-button"
              theme="theme-button-tiny square"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalSources({ open: true, source: 'uploads' });
              }}
            >
              <Icon icon={infoIcon} className="info-icon" />
            </Button>
          </div>
          <p>
            By uploading data you agree to the
            {' '}
            <a href="/terms" target="_blank" rel="noopenner nofollower">
              GFW Terms of Service
            </a>
          </p>
        </div>
      </div>
    );
  };

  render() {
    const {
      showDraw,
      setMapSettings,
      setAnalysisSettings,
      clearAnalysisError,
    } = this.props;
    return (
      <div className="c-chose-analysis">
        <div className="title">ANALYZE AND TRACK FOREST CHANGE</div>
        <div className="options">
          <button
            className={cx({ selected: !showDraw })}
            onClick={() => {
              setAnalysisSettings({ showDraw: false });
              setMapSettings({ drawing: false });
              clearAnalysisError();
            }}
          >
            <div className="button-wrapper">
              <Icon icon={squarePointIcon} className="icon-square-point" />
              <div className="label">CLICK A LAYER ON THE MAP</div>
            </div>
          </button>
          <button
            className={cx('draw-upload-tab', { selected: showDraw })}
            onClick={() => setAnalysisSettings({ showDraw: true })}
          >
            <div className="button-wrapper">
              <Icon icon={polygonIcon} className="icon-polygon" />
              <div className="label">DRAW OR UPLOAD SHAPE</div>
            </div>
          </button>
        </div>
        {showDraw ? this.renderPolygonOption() : this.renderLayerOption()}
      </div>
    );
  }
}

export default ChoseAnalysis;
