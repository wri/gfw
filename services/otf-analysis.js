import has from 'lodash/has';

import { apiRequest } from 'utils/request';

import otfData from 'data/otf-data';

// Perform a OTF(on the fly) analysis for un-cached widgets
// https://data-api.globalforestwatch.org/#tag/Analysis
class OTFAnalysis {
  constructor(geostoreId, geostoreOrigin = 'rw') {
    if (!geostoreId) {
      this.throwError(
        'geostoreId is required, new OTFAnalysis( -> geostoreId)'
      );
    }

    this.endpoint = 'https://data-api.globalforestwatch.org/analysis/';
    this.path = 'zonal';
    this.dataInstances = [];
    this.geostoreId = geostoreId;
    this.geostoreOrigin = geostoreOrigin;

    this.startDate = null;
    this.endDate = null;
  }

  // eslint-disable-next-line
  throwError(msg) {
    throw new Error(`OTFAnalysis: ${msg}`);
  }

  parseParam(prop, params) {
    // If variables are defined in prop, replace them with widget properties
    const match = prop.match(/{([a-zA-Z]+)}/g);
    let serializedProp = prop;

    if (match && match.length) {
      match.forEach(v => {
        const paramValue = v.replace(/{|}/g, '');
        if (!has(params, paramValue)) {
          this.throwError(`param ${paramValue} does not exsist in params`);
        }
        serializedProp = serializedProp.replace(v, params[paramValue]);
      });
    }
    return serializedProp;
  }

  parseProps(props = null, params) {
    const out = [];
    if (props) {
      props.forEach(prop => {
        out.push(this.parseParam(prop, params));
      });
    }
    return out;
  }

  setData(dependences, params = {}) {
    dependences.forEach(dep => {
      if (!has(otfData, dep)) {
        this.throwError(
          `data dependency ${dep} does not exsist in data/otf-data.js`
        );
      }

      if (!otfData[dep].sum) {
        this.throwError(
          `Sum is required and missing in: data/otf-data.js -> ${dep}`
        );
      }

      const sumFields = this.parseProps(otfData[dep].sum, params);
      const groupFields = this.parseProps(otfData[dep]?.groupBy, params);
      const filters = this.parseProps(otfData[dep]?.filters, params);

      this.dataInstances.push({
        key: dep,
        request: new Promise(resolve =>
          resolve(
            apiRequest.get(this.buildQuery(sumFields, groupFields, filters))
          )
        )
      });
    });
  }

  // eslint-disable-next-line
  setQueryParam(key, value, token = null) {
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
      this.throwError(
        'analysis requires a layer to fetch data. Use analysis.setLayer(layer, params) to continue'
      );
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
    return Promise.all(this.dataInstances.map(ins => ins.request))
      .then(responses => {
        return new Promise(resolve => {
          const out = {};
          responses.forEach((r, index) => {
            out[this.dataInstances[index].key] = r?.data;
          });
          resolve(out);
        });
      })
      .catch(e => {
        this.throwError(e);
      });
  }
}

export default OTFAnalysis;
