import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Popup as MapPopup } from 'react-map-gl';

import Dropdown from 'components/ui/dropdown';

import AreaSentence from './components/area-sentence';
import ArticleCard from './components/article-card';
import DataTable from './components/data-table';
import BoundarySentence from './components/boundary-sentence';
import ContextualSentence from './components/contextual-sentence';

class Popup extends Component {
  static propTypes = {
    showPopup: PropTypes.bool,
    isDashboard: PropTypes.bool,
    clearMapInteractions: PropTypes.func,
    setMapInteractionSelected: PropTypes.func,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    selected: PropTypes.object,
    interactionsOptions: PropTypes.array,
    interactionOptionSelected: PropTypes.object,
    activeDatasets: PropTypes.array,
    onClickAnalysis: PropTypes.func,
    map: PropTypes.object,
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

  handleClickAction = (selected) => {
    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    this.props.onClickAnalysis({
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
      latitude,
      longitude,
      map,
    } = this.props;

    if (selected?.isArticle) {
      return <ArticleCard data={selected} />;
    }

    const hasManyInteractions = interactionsOptions?.length > 1;
    const { isAoi, isBoundary, isPoint, isLayer } = selected || {};

    return (
      <div className="popup-body">
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
        {interactionOptionSelected?.label && !hasManyInteractions && (
          <div className="title">{interactionOptionSelected.label}</div>
        )}
        {isBoundary && (
          <BoundarySentence
            data={selected}
            onAnalyze={() => this.handleClickAction(selected)}
          />
        )}
        {isAoi && <AreaSentence data={selected} />}
        {!isBoundary && !isAoi && isLayer && (
          <DataTable
            selected={selected}
            map={map}
            onClose={this.handleClose}
            onAnalyze={() => this.handleClickAction(selected)}
            isPoint={isPoint}
          />
        )}
        {isPoint && !isLayer && (
          <ContextualSentence
            data={selected}
            latitude={latitude}
            longitude={longitude}
          />
        )}
      </div>
    );
  };

  render() {
    const {
      showPopup,
      latitude,
      longitude,
      clearMapInteractions,
      selected,
      isDashboard,
    } = this.props;
    const { isBoundary } = selected || {};

    if (showPopup && isBoundary && isDashboard) return null;

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
