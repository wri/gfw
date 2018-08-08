import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { render } from 'react-dom';

import PopupComponent from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getPopupProps } from './selectors';

import './styles.scss';

const L = window.L;

const mapStateToProps = ({ popup, datasets }) => ({
  ...popup,
  ...getPopupProps({ ...popup, ...datasets })
});

class PopupContainer extends Component {
  componentDidMount() {
    this.popup =
      this.popup ||
      L.popup({
        maxWidth: 400,
        minWidth: 240
      });
  }

  componentWillReceiveProps(nextProps) {
    const {
      latlng,
      layers,
      interactionLayers,
      data,
      layerSelected
    } = nextProps;
    if (!isEqual(latlng, this.props.latlng)) {
      this.setPopup(nextProps);
    }
    if (!isEqual(layers, this.props.layers)) {
      this.removePopup();
    } else if (
      !isEqual(interactionLayers, this.props.interactionLayers) ||
      !isEqual(data, this.props.data) ||
      !isEqual(layerSelected, this.props.layerSelected)
    ) {
      this.updatePopup(nextProps);
    }
  }

  buildPopup = nextProps => {
    const popupComponent = document.createElement('div');
    render(<PopupComponent {...nextProps} />, popupComponent);
    return popupComponent;
  };

  setPopup = nextProps => {
    const { map, latlng } = nextProps;
    this.popup
      .setLatLng(latlng)
      .setContent(this.buildPopup(nextProps))
      .openOn(map);
  };

  updatePopup = nextProps => {
    this.popup.setContent(this.buildPopup(nextProps));
  };

  removePopup = () => {
    this.popup.remove();
  };

  render() {
    return null;
  }
}

PopupContainer.propTypes = {
  map: PropTypes.object,
  latlng: PropTypes.array,
  layers: PropTypes.array,
  interactionLayers: PropTypes.object,
  data: PropTypes.array,
  layerSelected: PropTypes.string
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(PopupContainer);
