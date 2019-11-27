import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';

import * as ownActions from 'components/analysis/actions';
import * as modalActions from 'components/modals/sources/actions';
import * as mapActions from 'components/map/actions';
import * as menuActions from 'components/map-menu/actions';
import uploadConfig from 'components/analysis/upload-config.json';

import Component from './component';
import { getChooseAnalysisProps } from './selectors';

const actions = {
  ...mapActions,
  ...modalActions,
  ...menuActions,
  ...ownActions
};

class ChoseAnalysisContainer extends PureComponent {
  static propTypes = {
    setMapSettings: PropTypes.func,
    uploadShape: PropTypes.func,
    activeDatasets: PropTypes.array,
    activeBoundary: PropTypes.object,
    boundaries: PropTypes.array,
    setAnalysisLoading: PropTypes.func
  };

  state = {
    uploadStatus: 0,
    file: null
  };

  selectBoundaries = boundaryId => {
    const {
      setMapSettings,
      activeDatasets,
      activeBoundary,
      boundaries
    } = this.props;
    const boundaryItem = boundaries.find(b => b.value === boundaryId);
    const filteredLayers = activeBoundary
      ? activeDatasets.filter(l => l.dataset !== activeBoundary.dataset)
      : activeDatasets;
    if (boundaryId !== 'no-boundaries') {
      const newActiveDatasets = [
        {
          layers: boundaryItem.layers,
          dataset: boundaryItem.dataset,
          opacity: 1,
          visibility: true
        },
        ...filteredLayers
      ];
      setMapSettings({ datasets: newActiveDatasets });
    } else {
      setMapSettings({ datasets: filteredLayers });
    }
  };

  onCheckProgress = e => {
    this.setState({ uploadStatus: e.loaded / e.total * 50 });
  };

  onUploadProgress = e => {
    this.setState({
      uploadStatus: this.state.uploadStatus + e.loaded / e.total * 50
    });
  };

  onDropAccepted = files => {
    const file = files && files[0];
    this.setState({ file, uploadStatus: 0 });
    this.handleUploadShape(file);
  };

  onDropRejected = files => {
    const { setAnalysisLoading } = this.props;
    const file = files && files[0];

    if (files && file && files.length > 1) {
      setAnalysisLoading({
        error: 'Multiple files not supported',
        errorMessage:
          'Only single files of type .zip, .csv, .json, .geojson, .kml and .kmz fles are supported.'
      });
    } else if (file && !uploadConfig.types.includes(file.type)) {
      setAnalysisLoading({
        error: 'Invalid file type',
        errorMessage:
          'Only .zip, .csv, .json, .geojson, .kml and .kmz fles are supported.'
      });
    } else if (file && file.size > uploadConfig.sizeLimit) {
      setAnalysisLoading({
        error: 'File too large',
        errorMessage:
          'The recommended maximum fle size is 1MB. Anything larger than that may not work properly.'
      });
    } else {
      setAnalysisLoading({
        error: 'Error attaching file',
        errorMessage: 'Please contact us for support.'
      });
    }
  };

  handleUploadShape = file => {
    if (this.uploadShape) {
      this.uploadShape.cancel();
    }
    this.uploadShape = CancelToken.source();
    this.props.uploadShape({
      shape: file,
      onUploadProgress: this.onUploadProgress,
      onCheckProgress: this.onCheckProgress,
      token: this.uploadShape.token
    });
  };

  handleCancelUpload = () => {
    const { setAnalysisLoading } = this.props;
    if (this.uploadShape) {
      this.uploadShape.cancel('cancel upload shape');
    }
    setAnalysisLoading({
      uploading: false,
      loading: false,
      error: '',
      errorMessage: ''
    });
  };

  render() {
    return createElement(Component, {
      ...this.props,
      ...this.state,
      selectBoundaries: this.selectBoundaries,
      onDropAccepted: this.onDropAccepted,
      onDropRejected: this.onDropRejected,
      handleCancelUpload: this.handleCancelUpload,
      uploadConfig
    });
  }
}

export default connect(getChooseAnalysisProps, actions)(ChoseAnalysisContainer);
