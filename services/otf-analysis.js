import has from 'lodash/has';

import { apiRequest } from 'utils/request';

import otfLayers from 'data/otf-layers';

// Perform a OTF(on the fly) analysis for un-cached widgets
// https://data-api.globalforestwatch.org/#tag/Analysis
class OTFAnalysis {
  constructor(geostoreId, geostoreOrigin = 'rw') {
    if (!geostoreId) {
      this.throwError('geostoreId is required, new OTFAnalysis( -> geostoreId)');
    }

    this.endpoint = 'https://data-api.globalforestwatch.org/analysis/';
    this.path = 'zonal';
    this.layerInstance = null;
    this.geostoreId = geostoreId;
    this.geostoreOrigin = geostoreOrigin;
    this.sumFields = null;
    this.groupFields = null;
    this.layerFilters = null;
    this.startDate = null;
    this.endDate = null;

    this.query = null;
  }

  throwError(msg) { // eslint-disable-line
    throw new Error(`OTFAnalysis: ${msg}`);
  }

  setLayer(layer, params) {
    if (!has(otfLayers, layer)) {
      this.throwError(`layer ${layer} does not exsist in data/otf-layers.js`);
    }
    this.layerInstance = otfLayers[layer];
    this.sumFields = this.layerInstance.sum;
    this.groupFields = this.layerInstance.groupBy;
    if (this.layerInstance.filters) {
      this.layerFilters = [];
      this.layerInstance.filters.forEach(filter => {
        // If variables are defined in a filter, replace them with props
        // from current widget instance, if they don't exists we throw error
        const match = filter.match(/{([a-zA-Z]+)}/g);
        let f = filter;
        if (match && match.length) {
          match.forEach(v => {
            const paramValue = v.replace(/{|}/g, '');
            if (!has(params, paramValue)) {
              this.throwError(`param ${paramValue} does not exsist in params`);
            }
            f = f.replace(v, params[paramValue])
          });
          this.layerFilters.push(f);
        } else {
          this.layerFilters.push(f);
        }
      });
    }
  }

  setQueryParam(key, value, token = null) {
    this.query += `${token || '&'}${key}=${value}`;
  }

  filter(xIn) {
    this.layerFilters = xIn;
  }

  setDates({ startDate = null, endDate = null }) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  buildQuery() {
    const {
      endpoint,
      path,
      geostoreId,
      geostoreOrigin,
      sumFields,
      groupFields,
      layerFilters,
      startDate,
      endDate
    } = this;

    if (!sumFields) {
      this.throwError('sum is required to perform analysis analysis set layer to continue');
    }

    this.query = endpoint;
    this.query += `${path}/${geostoreId}`;

    this.setQueryParam('geostore_origin', geostoreOrigin, '?');

    sumFields.forEach(layer => {
      this.setQueryParam('sum', layer);
    });

    if (groupFields) {
      groupFields.forEach(group => {
        this.setQueryParam('group_by', group);
      });
    }

    if (layerFilters) {
      this.layerFilters.forEach(filter => {
        this.setQueryParam('filters', filter);
      });
    }

    if (startDate) {
      this.setQueryParam('start_date', startDate);
    }

    if (endDate) {
      this.setQueryParam('end_date', endDate);
    }
  }

  async getData() {
    this.buildQuery();
    return apiRequest.get(this.query);
  }

}

export default OTFAnalysis;
