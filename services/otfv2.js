import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';

class OTF {
  constructor(url) {
    this.endpoint =
      process.env.NEXT_PUBLIC_FEATURE_ENV === 'staging'
        ? GFW_STAGING_DATA_API
        : GFW_DATA_API;
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
    return `${this.url}?sql=${sql}&geostore_id=${this.geostoreId}&geostore_origin=${this.geostoreOrigin}`;
  }

  async fetch() {
    const sql = this.build();
    try {
      const request = await fetch(
        `${this.url}?sql=${sql}&geostore_id=${this.geostoreId}&geostore_origin=${this.geostoreOrigin}`
      );
      const response = await request.json();
      return response;
    } catch (e) {
      return null;
    }
  }
}

export default OTF;
