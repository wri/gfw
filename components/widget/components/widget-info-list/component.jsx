import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

import ipccForestIcon from 'assets/icons/widgets/ipcc/ipcc-forest.svg';
import ipccGrasslandIcon from 'assets/icons/widgets/ipcc/ipcc-grassland.svg';
import ipccSettlementIcon from 'assets/icons/widgets/ipcc/ipcc-settlement.svg';
import ipccWetlandIcon from 'assets/icons/widgets/ipcc/ipcc-wetland.svg';
import ipccCroplandIcon from 'assets/icons/widgets/ipcc/ipcc-cropland.svg';
import ipccOtherIcon from 'assets/icons/widgets/ipcc/ipcc-other.svg';

const ICONS = {
  ipccForest: ipccForestIcon,
  ipccGrassland: ipccGrasslandIcon,
  ipccSettlement: ipccSettlementIcon,
  ipccWetland: ipccWetlandIcon,
  ipccCropland: ipccCroplandIcon,
  ipccOther: ipccOtherIcon,
};

export const WidgetInfoList = ({ data, large, embed, analysis }) => {
  if (!data) return null;

  const containsIcons =
    data.map(({ icon }) => !!icon).filter((el) => !!el).length > 0;

  return (
    <div
      className={cx('c-info-list-widget', {
        '-large': (large || embed) && !analysis,
        '-small': (!large && !embed) || analysis,
        '-center-items': !containsIcons,
      })}
    >
      {data.map(({ icon, label, text, subText }, idx) => (
        <div className="c-info-list-widget__item" key={idx}>
          {containsIcons && (
            <div className="c-info-list-widget__item-image">
              {ICONS[icon] && <img src={ICONS[icon]} alt={label} />}
            </div>
          )}
          <div className="c-info-list-widget__item-content">
            {label && (
              <span className="c-info-list-widget__item-label">{label}</span>
            )}
            {text && (
              <span className="c-info-list-widget__item-text">{text}</span>
            )}
            {subText && (
              <span className="c-info-list-widget__item-subText">
                {subText}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

WidgetInfoList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      text: PropTypes.string,
      subText: PropTypes.string,
    })
  ),
  large: PropTypes.bool,
  embed: PropTypes.bool,
  analysis: PropTypes.bool,
};

export default WidgetInfoList;
