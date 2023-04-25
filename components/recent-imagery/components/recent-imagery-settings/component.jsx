import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { format } from 'd3-format';
import startCase from 'lodash/startCase';
import { trackEvent } from 'utils/analytics';
import cx from 'classnames';

import { Slider } from 'vizzuality-components';

// import Slider from 'components/ui/slider';
import Loader from 'components/ui/loader';
import Dropdown from 'components/ui/dropdown';
import Datepicker from 'components/ui/datepicker';
import NoContent from 'components/ui/no-content';
import RefreshButton from 'components/ui/refresh-button';

import WEEKS from 'data/weeks.json';
import BANDS from 'data/bands.json';

import RecentImageryThumbnail from '../recent-imagery-thumbnail';

class RecentImagerySettings extends PureComponent {
  state = {
    selected: null,
    clouds: this.props.settings.clouds,
  };

  handleCloundsChange = (clouds) => {
    this.setState({ clouds });
  };

  render() {
    const {
      className,
      activeTile,
      tiles,
      loading,
      settings: { date, weeks, bands },
      setRecentImagerySettings,
      setRecentImageryLoading,
      resetRecentImageryData,
      error,
    } = this.props;
    const selected = this.state.selected || activeTile || {};

    return (
      <div
        className={cx(
          'c-recent-imagery-settings prompts-recent-imagery',
          className
        )}
      >
        <div className="top-section">
          <div className="dates">
            <div className="title">ACQUISITION DATE</div>
            <div className="buttons">
              <Dropdown
                className="time-range-selector"
                theme="theme-dropdown-native-button-green"
                value={weeks}
                options={WEEKS}
                onChange={(option) => {
                  setRecentImagerySettings({ weeks: option });
                  trackEvent({
                    category: 'Map settings',
                    action: 'Recent imagery feature',
                    label: 'User changes date range',
                  });
                }}
                native
              />
              <div className="before">before</div>
              <Datepicker
                selected={date ? new Date(date) : new Date()}
                onChange={(d) => {
                  setRecentImagerySettings({
                    date: moment(d).format('YYYY-MM-DD'),
                  });
                  trackEvent({
                    category: 'Map settings',
                    action: 'Recent imagery feature',
                    label: 'User changes start date',
                  });
                }}
                minDate={new Date('2013-01-01')}
                maxDate={new Date()}
                popperPlacement="bottom-end"
              />
            </div>
          </div>
          <div className="clouds">
            <div className="title">MAXIMUM CLOUD COVER PERCENTAGE</div>
            <Slider
              className="theme-slider-green"
              value={this.state.clouds}
              marks={{
                0: '0%',
                25: '25%',
                50: '50%',
                75: '75%',
                100: '100%',
              }}
              marksOnTop
              step={5}
              dots
              onChange={this.handleCloundsChange}
              onAfterChange={(d) => {
                setRecentImagerySettings({ clouds: d });
                trackEvent({
                  category: 'Map settings',
                  action: 'Recent imagery feature',
                  label: 'User changes cloud-cover value',
                });
              }}
              handleStyle={{
                backgroundColor: 'white',
                borderRadius: '2px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
                border: '0px',
                zIndex: 2,
              }}
              trackStyle={{ backgroundColor: '#97be32' }}
            />
          </div>
        </div>
        <div className="thumbnails">
          {!loading && tiles && !!tiles.length && (
            <Fragment>
              <div key="thumbnails-header" className="header">
                <div className="description">
                  <p>
                    {moment(selected.dateTime)
                      .format('DD MMM YYYY')
                      .toUpperCase()}
                  </p>
                  <p>{format('.0f')(selected.cloudScore)}% cloud coverage</p>
                  <p>{startCase(selected.instrument)}</p>
                </div>
                <Dropdown
                  className="band-selector"
                  theme="theme-dropdown-native-button-green"
                  value={bands}
                  options={BANDS}
                  onChange={(option) => {
                    resetRecentImageryData();
                    setRecentImagerySettings({
                      bands: option === '0' ? 0 : option,
                      selected: null,
                      selectedIndex: 0,
                    });
                    trackEvent({
                      category: 'Map settings',
                      action: 'Recent imagery feature',
                      label: 'User changes image type',
                    });
                  }}
                  native
                />
              </div>
              <div className="thumbnail-grid">
                {tiles &&
                  !error &&
                  !!tiles.length &&
                  tiles.map((tile, i) => (
                    <RecentImageryThumbnail
                      key={tile.id}
                      id={i}
                      tile={tile}
                      selected={!!activeTile && activeTile.id === tile.id}
                      handleClick={() => {
                        setRecentImagerySettings({
                          selected: tile.id,
                          selectedIndex: i,
                        });
                      }}
                      handleMouseEnter={() => {
                        this.setState({
                          selected: tile,
                        });
                      }}
                      handleMouseLeave={() => {
                        this.setState({ selected: null });
                      }}
                    />
                  ))}
              </div>
            </Fragment>
          )}
          {error && (
            <RefreshButton
              refetchFn={() => {
                setRecentImageryLoading({ loading: false, error: false });
                trackEvent({
                  category: 'Refetch data',
                  action: 'Data failed to fetch, user clicks to refetch',
                  label: 'Recent imagery',
                });
              }}
            />
          )}
          {!error && (!tiles || !tiles.length) && !loading && (
            <NoContent
              className="placeholder"
              message="We can't find additional images for the selection"
            />
          )}
          {loading && !error && <Loader className="placeholder" />}
        </div>
      </div>
    );
  }
}

RecentImagerySettings.propTypes = {
  className: PropTypes.string,
  activeTile: PropTypes.object,
  tiles: PropTypes.array,
  settings: PropTypes.object,
  setRecentImagerySettings: PropTypes.func,
  setRecentImageryLoading: PropTypes.func,
  resetRecentImageryData: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

export default RecentImagerySettings;
