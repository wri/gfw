import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg';
import config from './upload-file-config.json';

import './polygon-analysis-styles.scss';

class PolygonAnalysis extends PureComponent {
  onDrop = files => {
    const { uploadShape } = this.props;
    const file = files[0];
    if (file.size > config.sizeLimit && !window.confirm(config.sizeMessage)) {
      return;
    }

    uploadShape(file);
  };

  renderChooser = () => {
    const { setModalMeta } = this.props;
    return (
      <div className="c-polygon-analysis__chooser">
        <div className="c-polygon-analysis__chooser-title">
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
        <div className="c-polygon-analysis__chooser-separator">or</div>
        <Dropzone
          onDrop={this.onDrop}
          className="c-polygon-analysis__chooser-input"
        >
          <p>Click to pick a file or drop one here</p>
          <Button
            className="theme-button-tiny square info-button"
            onClick={() => setModalMeta('drop-shapefile')}
          >
            <Icon icon={infoIcon} className="info-icon" />
          </Button>
        </Dropzone>
      </div>
    );
  };

  renderData = () => {
    const { analysis: { data } } = this.props;

    return (
      <div>
        {data.areaHa && <div>areaHa: {data.areaHa}</div>}
        {data.gain && <div>gain: {data.gain}</div>}
        {data.loss && <div>loss: {data.loss}</div>}
        {data.treeExtent && <div>treeExtent: {data.treeExtent}</div>}
        {data.treeExtent2010 && (
          <div>treeExtent2010: {data.treeExtent2010}</div>
        )}
      </div>
    );
  };

  render() {
    const { analysis: { data } } = this.props;
    return (
      <div className="c-polygon-analysis">
        {!data && this.renderChooser()}
        {data && this.renderData()}
      </div>
    );
  }
}

PolygonAnalysis.propTypes = {
  analysis: PropTypes.object,
  setAnalysisData: PropTypes.func,
  setModalMeta: PropTypes.func,
  uploadShape: PropTypes.func
};

export default PolygonAnalysis;
