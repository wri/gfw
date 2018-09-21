import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';

import './styles.scss';

class BoundarySentence extends Component {
  handleSetAnalysisView = () => {
    const { setAnalysisView, selected, data } = this.props;
    setAnalysisView({ ...selected, data: { ...data, level: data.level - 1 } });
  };

  render() {
    const { data } = this.props;
    let name = data[`name_${data.level}`];
    if (!data.gid_0) {
      name = data[Object.keys(data).find(k => k.includes('name'))];
    }
    const area = data[Object.keys(data).find(k => k.includes('area'))];

    return data ? (
      <div className="c-boundary-sentence">
        <b>{name}</b>
        {', '}
        {data.level === 2 ? (
          <button onClick={this.handleSetAnalysisView}>{data.name_1}</button>
        ) : null}
        {data.level === 2 && ', '}
        {data.level > 0 ? (
          <button onClick={this.handleSetAnalysisView}>{data.name_0}</button>
        ) : null}
        {data.level > 0 && ', '}
        {'with a total area of '}
        <b>{formatNumber({ num: area / 10000, unit: 'ha' })}</b>
        {'.'}
      </div>
    ) : null;
  }
}

BoundarySentence.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  setAnalysisView: PropTypes.func,
  selected: PropTypes.object
};

export default BoundarySentence;
