import PropTypes from 'prop-types';

import './styles.scss';

export const PlanetMenu = ({
  isDesktop,
  selectBasemap,
  planetBasemapSelected,
  planetYears,
  planetYearSelected,
  planetPeriods,
  planetPeriodSelected,
  onClick
}) => {
  const { name, interval, year, period } = planetBasemapSelected || {};
  const basemap = {
    value: 'planet',
    name,
    interval,
    planetYear: year,
    period,
  };

  return (
    <button
      className="c-planet-menu"
      onClick={onClick}
    >
      <div
        className="basemaps-list-item-image"
        style={{
          backgroundImage: `url(${item.image})`,
        }}
      />
      <span
        className="basemaps-list-item-name"
        onClick={(e) => e.stopPropagation()}
      >
        {item.label}
        <div className="basemaps-list-item-selectors">
          <Tooltip
            useContext
            theme="light"
            arrow
            interactive
            onRequestClose={() => this.setState({ planetTooltipOpen: false })}
            open={planetTooltipOpen}
            html={(
              <div className="c-basemaps-tooltip">
                <span
                  className="planet-tooltip-close"
                  onClick={() => this.setState({ planetTooltipOpen: false })}
                >
                  <Icon icon={closeIcon} />
                </span>
                {planetYears && planetPeriods ? (
                  <div className="date-selectors">
                    <Dropdown
                      className="year-selector"
                      label="Year"
                      theme="theme-dropdown-native"
                      value={planetYearSelected}
                      options={planetYears}
                      onChange={(selected) => {
                        const selectedYear = planetYears.find(
                          (f) => f.value === parseInt(selected, 10)
                        );
                        selectBasemap({
                          value: 'planet',
                          interval:
                            (selectedYear && selectedYear.interval) || null,
                          period:
                            (selectedYear && selectedYear.period) || null,
                          planetYear: parseInt(selected, 10),
                          name: (selectedYear && selectedYear.name) || '',
                        });
                      }}
                      native
                    />
                    <Dropdown
                      className="period-selector"
                      label="Period"
                      theme="theme-dropdown-native"
                      value={planetPeriodSelected}
                      options={planetPeriods}
                      onChange={(selected) => {
                        const selectedPeriod = planetPeriods.find(
                          (f) => f.value === selected
                        );
                        selectBasemap({
                          value: 'planet',
                          period: selected,
                          interval:
                            (selectedPeriod && selectedPeriod.interval) || '',
                          planetYear:
                            (selectedPeriod && selectedPeriod.year) || '',
                          name: (selectedPeriod && selectedPeriod.name) || '',
                        });
                      }}
                      native
                    />
                  </div>
                ) : (
                  <div className="date-selectors">
                    <p>There was an error retrieving the data.</p>
                  </div>
                )}
              </div>
            )}
            trigger="click"
            position="top"
          >
            <span
              className="planet-label"
              onClick={() => {
                this.setState({ planetTooltipOpen: !planetTooltipOpen });
              }}
            >
              {(planetBasemapSelected && planetBasemapSelected.label) ||
                'Select...'}
              <Icon icon={arrowIcon} className="arrow-icon" />
            </span>
          </Tooltip>
        </div>
      </span>
    </button>
  )
}

PlanetMenu.propTypes = {
  image: PropTypes.string,
  label: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}

export default PlanetMenu;