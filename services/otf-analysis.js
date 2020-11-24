import { apiRequest } from 'utils/request';

// Perform a OTF(on the fly) analysis for un-cached widgets
// https://data-api.globalforestwatch.org/#tag/Analysis
class OTFAnalysis {
  constructor(geostoreId, geostoreOrigin = 'gfw') {
    if (!geostoreId) {
      throw new Error('OTFAnalysis: geostoreId is required');
    }

    this.endpoint = 'https://data-api.globalforestwatch.org/analysis/';
    this.path = 'zonal';
    this.geostoreId = geostoreId;
    this.geostoreOrigin = geostoreOrigin;
    this.sumLayers = null;
    this.groupLayers = null;
    this.layerFilters = null;
    this.startDate = null;
    this.endDate = null;

    this.query = null;
  }

  sum(xIn) {
    this.sumLayers = xIn;
  }


  groupBy(xIn) {
    this.groupLayers = xIn;
  }

  filter(xIn) {
    this.layerFilters = xIn;
  }

  setDates({ startDate = null, endDate = null }) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  buildQuery() {
    if (!this.sumLayers) { throw new Error('OTFAnalysis: sum is required to perform analysis') }
    this.query = this.endpoint;
    this.query += `${this.path}/${this.geostoreId}`;

    this.query += `?geostore_origin=${this.geostoreOrigin}`;

    this.sumLayers.forEach(layer => {
      this.query += `&sum=${layer}`;
    });

    if (this.groupLayers) {
      this.query += `&group_by=${this.groupBy.join(',')}`;
    }

    if (this.layerFilters) {
      this.query += `&filters=${this.layerFilters.join(',')}`;
    }

    if (this.startDate) {
      this.query += `&start_date=${this.startDate}`;
    }

    if (this.endDate) {
      this.query += `&end_date=${this.endDate}`;
    }
  }

  async getData() {
    this.buildQuery();
    const data = await apiRequest.get(this.query);
    console.log('data', data);
  }

}

export default OTFAnalysis;
