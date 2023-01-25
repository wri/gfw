import { PROXIES } from 'utils/proxies';

class OTF {
  constructor(url) {
    this.endpoint = PROXIES.DATA_API;
    this.url = `${this.endpoint}${url}`;
    this.table = 'data';
    this.selectStmt = null;
    this.whereStmt = null;
    this.groupByStmt = null;

    this.geostoreId = null;
    this.geostoreOrigin = 'rw';

    this.limitStmt = null;
    this.offsetStmt = null;
  }

  select(statement) {
    this.selectStmt = statement;
  }

  setTable(table) {
    this.table = table;
  }

  // eslint-disable-next-line class-methods-use-this
  parseStatement(statement) {
    let statementStr = '';
    statement.forEach((condition, index) => {
      const postfix = statement.length - 1 === index ? '' : ' AND ';
      if (typeof condition === 'string') {
        statementStr += `${condition}${postfix}`;
      } else {
        const key = Object.keys(condition);
        statementStr += `${key} ${condition[key]}${postfix}`;
      }
    });

    return statementStr;
  }

  geostore({ id, origin = 'rw' }) {
    this.geostoreId = id;
    this.origin = origin;
  }

  where(statement) {
    this.whereStmt = this.parseStatement(statement);
  }

  groupBy(statement) {
    this.groupByStmt = this.parseStatement(statement);
  }

  limit(value) {
    this.limitStmt = value;
  }

  offset(value) {
    this.offsetStmt = value;
  }

  build() {
    let query = '';

    query += `SELECT ${this.selectStmt} `;
    query += `FROM ${this.table} `;
    query += `WHERE ${this.whereStmt} `;

    if (this.groupByStmt) {
      query += `GROUP BY ${this.groupByStmt}`;
    }

    if (this.limitStmt) {
      query += ` LIMIT ${this.limitStmt}`;
    }

    if (this.offsetStmt) {
      query += ` OFFSET ${this.offsetStmt}`;
    }

    return query;
  }

  getURL() {
    const sql = this.build();
    let geostoreRequestUrl = `${this.url}?sql=${sql}&geostore_id=${this.geostoreId}&geostore_origin=${this.geostoreOrigin}`;
    if (!this.geostoreId) {
      geostoreRequestUrl = `${this.url}?sql=${sql}`;
    }
    return geostoreRequestUrl;
  }

  async fetch() {
    const sql = this.build();
    let geostoreRequest = `${this.url}?sql=${sql}&geostore_id=${this.geostoreId}&geostore_origin=${this.geostoreOrigin}`;
    if (!this.geostoreId) {
      geostoreRequest = `${this.url}?sql=${sql}`;
    }
    try {
      const request = await fetch(geostoreRequest);
      const response = await request.json();
      return response;
    } catch (e) {
      return null;
    }
  }
}

export default OTF;
