import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';
import DATASETS from 'data/analysis-datasets.json';
import { GFW_API } from 'utils/constants';
import { apiRequest } from 'utils/request';

import constants from './constants';
import responseParser from './response-parser';

const DATASETS_ENV = DATASETS[process.env.FEATURE_ENV || 'production'];

function serializeValue(value, param) {
  if (typeof value === 'number' || (param !== 'adm0' && param !== 'confidence')) return value;
  return `${value}`;
}

class Service {
  constructor(type, params) {
    // * Initialize service with some initial processing
    this.config = constants;
    this.type = type;
    this.sql = '';
    this.props = this.parseParams(params);
    this.handleWidgetSpecifics();
    this.allPolynames = forestTypes.concat(landCategories);

    // * Start parsing our sql query
    this.parseWhere();
  }

  /**
    * @function handleWidgetSpecifics
    * @description parses and resolves widget specific properties based on type
    * @returns {Void} sets factory properties when resolved
  * */
  handleWidgetSpecifics() {
    const { type } = this;
    const { params } = this.props;
    const { sql } = this.config;
    if (type === 'loss' && params.lossTsc) {
      this.sql = sql.lossTsc
    } else {
      this.sql = sql[type];
    }
  }

  parseParams(params) {
    const { ALLOWED_PARAMS } = this.config;
    const { type, dataset } = params || {};
    const paramKeys = params && Object.keys(params);
    const allowedParams = ALLOWED_PARAMS[params.dataset || 'annual'];
    const paramKeysFiltered = paramKeys.filter(
      p => (params[p] || p === 'threshold') && allowedParams.includes(p)
    );
    return {
      params,
      paramKeys: allowedParams,
      paramKeysFiltered,
      type,
      dataset
    }
  }

  /* *
  * @function polyNameMeta
  * @description parses poly name meta info used in where condition
  * @returns {Object} poly name meta
  * */
  polyNameMeta(params, param) {
    const { config, allPolynames } = this;
    const isPolyname = config.POLYNAME_CATEGORIES.includes(param);
    const meta = allPolynames.find( pname => pname.value === params[param]);
    return {
      isPolyname,
      meta: meta || undefined
    }
  }

  handleTableKey(polyNameMeta) {
    const { dataset } = this.props;
    if (polyNameMeta) {
      return polyNameMeta.tableKey || polyNameMeta.tableKeys[dataset || 'annual'];
    }
    return undefined;
  }

  handleParamKey(param) {
    const { type } = this.props;
    if (param === 'confidence') return 'confidence__cat';
    if (param === 'threshold') return 'umd_tree_cover_density__threshold';
    if (param === 'adm0' && type === 'country') return 'iso';
    if (param === 'adm0' && type === 'geostore') return 'geostore__id';
    if (param === 'adm0' && type === 'wdpa') return 'wdpa_protected_area__id';
    return param;
  }

  serializeParam(param) {
    const { params } = this.props;
    const { isPolyname, meta } = this.polyNameMeta(params, param);
    const tableKey = this.handleTableKey(meta);
    const paramKey = this.handleParamKey(param);
    const value = isPolyname ? 1 : params[param];

    function canCompare() {
      return isPolyname && meta && tableKey &&
        !tableKey.includes('is__') &&
        meta.default &&
        meta.categories
    }

    const steps = [
      isPolyname && tableKey && tableKey.includes('is__') ? `${tableKey} = 'true'` : null,
      isPolyname && tableKey && !tableKey.includes('is__') ? `${tableKey} is not 0` : null,
      canCompare() ? `${tableKey} ${meta.comparison || '='} '${meta.default}'` : null,
      !isPolyname ? `${paramKey} = '${serializeValue(value, param)}'` : null
    ];
    return steps.filter(Boolean);
  }

  parseWhere() {
    const { paramKeysFiltered } = this.props;
    if (paramKeysFiltered && paramKeysFiltered.length) {
      let out = `WHERE `;
      const conditions = [];
      paramKeysFiltered.forEach(param => {
        conditions.push(this.serializeParam(param));
      });
      out = `${out} ${conditions.join(' AND ')}`;
      this.sql = this.sql.replace('{WHERE}', out);
    } else {
      this.sql = '';
    }
  }

  getRequestUrl() {
    const { params: { type, dataset, adm1, adm2, datasetType, grouped = false } } = this.props;
    const { typeByGrouped } = this.config;

    let typeByLevel = type;
    if (type === 'country' || type === 'global') {
      if (!adm1) typeByLevel = 'adm0';
      if (adm1) typeByLevel = 'adm1';
      if (adm2 || datasetType === 'daily') typeByLevel = 'adm2';
      typeByLevel = typeByGrouped[typeByLevel][grouped ? 'grouped' : 'default'];
    }

    const targetDataset = `${dataset.toUpperCase()}_${typeByLevel.toUpperCase()}_${datasetType.toUpperCase()}`;
    const datasetId = DATASETS_ENV[targetDataset];

    return `${GFW_API}/query/${datasetId}`
  }

  getSql() {
    return this.sql.replace(/ +(?= )/g,'');
  }

  async getData() {
    const { type } = this;
    const parseResponse = type in responseParser ? responseParser[type] : responseParser.default;
    const url = this.getRequestUrl();
    const sql = this.getSql();
    const response = await apiRequest.get(`${url}?sql=${sql}`);
    return new Promise((resolve, reject) => {
      if (!response) reject();
      resolve(parseResponse(response));
    });
  }
}

const AnalysisService = (type, params) => new Service(type, params);
export default AnalysisService;
