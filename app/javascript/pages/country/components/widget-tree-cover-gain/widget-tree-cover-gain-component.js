import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';
import WidgetHeader from '../widget-header/widget-header';
import numeral from 'numeral';

class WidgetTreeCoverGain extends PureComponent {
  render() {
    const {
      isLoading,
      countryData,
      topRegions,
      totalAmount,
      percentage,
      startYear,
      endYear
    } = this.props;
    return (
      <div className="c-widget c-widget-tree-cover-gain">
        <WidgetHeader
          title={`TREE COVER GAIN IN ${countryData.name}`}
          noMap={false} />
        <div className="c-widget-tree-cover-gain__container">
          <div className="c-widget-tree-cover-gain__info">
            <p className="title">Hansen - UMD</p>
            <p>
              Over the period of {startYear}-{endYear} {countryData.name} gained
              <strong> {numeral(Math.round(totalAmount / 1000)).format('0,0')} </strong>
              Ha of tree cover country-wide, equivalent to <strong>{numeral(Math.round(percentage)).format('0,0')}%</strong> of countries total value.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

WidgetTreeCoverGain.propTypes = {
};

export default WidgetTreeCoverGain
