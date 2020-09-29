import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import bbox from 'turf-bbox';
import { Popup as MapPopup } from 'react-map-gl';

// import Button from 'components/ui/button';
import Dropdown from 'components/ui/dropdown';

import AreaSentence from './components/area-sentence';
import ArticleCard from './components/article-card';
import DataTable from './components/data-table';
import BoundarySentence from './components/boundary-sentence';

class Popup extends Component {
  static propTypes = {
    showPopup: PropTypes.bool,
    clearMapInteractions: PropTypes.func,
    setMapInteractionSelected: PropTypes.func,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    selected: PropTypes.object,
    interactionsOptions: PropTypes.array,
    interactionOptionSelected: PropTypes.object,
    activeDatasets: PropTypes.array,
    onSelectBoundary: PropTypes.func,
    setMapSettings: PropTypes.func,
  };

  componentDidUpdate(prevProps) {
    const { interactionsOptions, activeDatasets } = this.props;

    if (
      isEmpty(interactionsOptions) &&
      !isEqual(activeDatasets?.length, prevProps.activeDatasets?.length)
    ) {
      this.handleClose();
    }
  }

  handleClickZoom = (selected) => {
    const { setMapSettings } = this.props;
    const newBbox = bbox(selected.geometry);
    setMapSettings({ canBound: true, bbox: newBbox });
    this.handleClose();
  };

  handleClickAction = (selected, handleAction) => {
    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    handleAction({
      data,
      layer,
      geometry,
      isUse,
      isAdmin,
      isWdpa,
    });

    this.handleClose();
  };

  // when clicking popup action the map triggers the interaction event
  // causing the popup to open again. this stops it for now.
  handleClose = () => {
    setTimeout(() => this.props.clearMapInteractions(), 300);
  };

  renderPopupBody = () => {
    const {
      selected,
      interactionOptionSelected,
      interactionsOptions,
      setMapInteractionSelected,
      onSelectBoundary,
    } = this.props;

    if (selected?.isArticle) {
      return <ArticleCard data={selected} />;
    }

    const hasManyInteractions = interactionsOptions?.length > 1;
    const { isAoi, isBoundary } = selected || {};

    return (
      <div className="popup-table">
        {hasManyInteractions && (
          <Dropdown
            className="layer-selector"
            theme="theme-dropdown-native"
            value={interactionOptionSelected}
            options={interactionsOptions}
            onChange={setMapInteractionSelected}
            native
          />
        )}
        {interactionOptionSelected && !hasManyInteractions && (
          <div className="popup-title">{interactionOptionSelected.label}</div>
        )}
        {isBoundary && (
          <BoundarySentence
            data={selected}
            onSelectBoundary={onSelectBoundary}
          />
        )}
        {isAoi && (
          <AreaSentence
            selected={selected}
            data={selected}
            onSelectBoundary={onSelectBoundary}
          />
        )}
        {!isBoundary && !isAoi && <DataTable data={selected} />}
        {/* <div className="popup-footer">
          {zoomToShape && (
            <Button onClick={() => this.handleClickZoom(selected)}>
              Zoom
            </Button>
          )}
          {!zoomToShape &&
            !selected.aoi &&
            buttons &&
            buttons.map((p) => (
              <Button
                key={p.label}
                onClick={() => {
                  this.handleClickAction(selected, p.action);
                }}
              >
                {p.label}
              </Button>
            ))}
        </div> */}
      </div>
    );
  };

  render() {
    const { showPopup, latitude, longitude, clearMapInteractions } = this.props;

    return showPopup ? (
      <MapPopup
        latitude={latitude}
        longitude={longitude}
        onClose={clearMapInteractions}
        closeOnClick={false}
      >
        <div className="c-popup">{this.renderPopupBody()}</div>
      </MapPopup>
    ) : null;
  }
}

export default Popup;
