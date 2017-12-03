import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

class WidgetTreeLossSettings extends PureComponent {
  indicatorChange = value => {
    this.props.onIndicatorChange(value.value);
  };

  canopyChange = value => {
    this.props.onCanopyChange(value.value);
  };

  startYearChange = value => {
    this.props.onStartYearChange(value.value);
  };

  endYearChange = value => {
    this.props.onEndYearChange(value.value);
  };

  iconRenderer = () => (
    <svg className="icon icon-angle-arrow-down">
      <use xlinkHref="#icon-angle-arrow-down">{}</use>
    </svg>
  );

  render() {
    const { indicators, canopies, settings, yearsLoss } = this.props;

    const startYears = [];
    const endYears = [];
    yearsLoss.forEach(item => {
      if (item.value < settings.endYear) {
        startYears.push({
          label: item.label,
          value: item.value
        });
      }
      if (item.value > settings.startYear) {
        endYears.push({
          label: item.label,
          value: item.value
        });
      }
    });

    return (
      <div className="c-widget-settings">
        <div className="c-widget-settings__select">
          <div className="c-widget-settings__title">LOCATION</div>
          <Select
            iconRenderer={this.iconRenderer}
            value={settings.indicator}
            options={indicators}
            onChange={this.indicatorChange}
          />
        </div>
        <div className="c-widget-settings__button-select -years">
          <div className="c-widget-settings__title">YEARS</div>
          <div className="c-widget-settings__container-years">
            <Select
              value={settings.startYear}
              options={startYears}
              onChange={this.startYearChange}
            />
            <span className="text-date">to</span>
            <Select
              value={settings.endYear}
              options={endYears}
              onChange={this.endYearChange}
            />
          </div>
        </div>
        <div className="c-widget-settings__button-select">
          <div className="c-widget-settings__title">CANOPY DENSITY</div>
          <Select
            value={settings.canopy}
            options={canopies}
            onChange={this.canopyChange}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeLossSettings.propTypes = {
  indicators: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  yearsLoss: PropTypes.array.isRequired,
  onIndicatorChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired,
  onStartYearChange: PropTypes.func.isRequired,
  onEndYearChange: PropTypes.func.isRequired
};

export default WidgetTreeLossSettings;
