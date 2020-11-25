import has from 'lodash/has';

import { apiRequest } from 'utils/request';

import otfData from 'data/otf-data';

// Perform a OTF(on the fly) analysis for un-cached widgets
// https://data-api.globalforestwatch.org/#tag/Analysis
class OTFAnalysis {
  constructor(geostoreId, geostoreOrigin = 'rw') {
    if (!geostoreId) {
      this.throwError('geostoreId is required, new OTFAnalysis( -> geostoreId)');
    }

    this.endpoint = 'https://data-api.globalforestwatch.org/analysis/';
    this.path = 'zonal';
    this.dataInstances = [];
    this.geostoreId = geostoreId;
    this.geostoreOrigin = geostoreOrigin;

    this.startDate = null;
    this.endDate = null;
  }

  throwError(msg) { // eslint-disable-line
    throw new Error(`OTFAnalysis: ${msg}`);
  }

  parseFilters(filters = null, params) {
    const out = [];
    if (filters) {
      filters.forEach(filter => {
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
          out.push(f);
        } else {
          out.push(f);
        }
      });
    }
    return out;
  }

  setData(dependences, params = {}) {
    dependences.forEach(dep => {
      if (!has(otfData, dep)) {
        this.throwError(`data dependency ${dep} does not exsist in data/otf-data.js`);
      }
      const sumFields = otfData[dep].sum;
      const groupFields = otfData[dep].groupBy;
      const filters = this.parseFilters(otfData[dep].filters, params);
      this.dataInstances.push({
        key: dep,
        request: new Promise(
          resolve => resolve(apiRequest.get(this.buildQuery(sumFields, groupFields, filters))
        ))
      });
    });
  }

  setQueryParam(key, value, token = null) { // eslint-disable-line
    return `${token || '&'}${key}=${value}`;
  }

  setDates({ startDate = null, endDate = null }) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  buildQuery(sumFields = null, groupFields = null, filters = null) {
    const {
      endpoint,
      path,
      geostoreId,
      geostoreOrigin,
      startDate,
      endDate
    } = this;
    let url = '';
    if (!sumFields) {
      this.throwError('analysis requires a layer to fetch data. Use analysis.setLayer(layer, params) to continue');
    }

    url = endpoint;
    url += `${path}/${geostoreId}`;

    url += this.setQueryParam('geostore_origin', geostoreOrigin, '?');

    sumFields.forEach(layer => {
      url += this.setQueryParam('sum', layer);
    });

    if (groupFields) {
      groupFields.forEach(group => {
        url += this.setQueryParam('group_by', group);
      });
    }

    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        url += this.setQueryParam('filters', filter);
      });
    }

    if (startDate) {
      url += this.setQueryParam('start_date', startDate);
    }

    if (endDate) {
      url += this.setQueryParam('end_date', endDate);
    }

    return url;
  }

  async getData() {
    return Promise.all(this.dataInstances.map(ins => ins.request)).then(responses => {
      return new Promise((resolve) => {
        const out = {};
        responses.forEach((r, index) => {
          out[this.dataInstances[index].key] = r?.data;
        });
        resolve(out);
      })
    })
  }
}

export default OTFAnalysis;
