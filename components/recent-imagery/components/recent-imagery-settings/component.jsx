import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { format } from 'd3-format';
import startCase from 'lodash/startCase';
import { track } from 'app/analytics';

import { Slider } from 'vizzuality-components';

import Icon from 'components/ui/icon';
// import Slider from 'components/ui/slider';
import Loader from 'components/ui/loader';
import Dropdown from 'components/ui/dropdown';
import Button from 'components/ui/button';
import Datepicker from 'components/ui/datepicker';
import NoContent from 'components/ui/no-content';
import RefreshButton from 'components/ui/refresh-button';

import WEEKS from 'data/weeks.json';
import BANDS from 'data/bands.json';
import closeIcon from 'assets/icons/close.svg?sprite';
import infoIcon from 'assets/icons/info.svg?sprite';

import RecentImageryThumbnail from '../recent-imagery-thumbnail';

import './styles.scss';

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
      activeTile,
      tiles,
      loading,
      settings: { date, weeks, bands },
      setRecentImagerySettings,
      setRecentImageryLoading,
      resetRecentImageryData,
      setModalMetaSettings,
      onClickClose,
      error,
    } = this.props;
    const selected = this.state.selected || activeTile || {};

    return (
      <div className="c-recent-imagery-settings prompts-recent-imagery">
        <div className="top-section">
          <div className="recent-menu">
            <div className="title">Recent satellite imagery</div>
            <div className="recent-actions">
              <Button
                className="info-btn"
                theme="theme-button-tiny theme-button-grey-filled square"
                onClick={() => setModalMetaSettings('recent_satellite_imagery')}
              >
                <Icon icon={infoIcon} />
              </Button>
              <button className="close-btn" onClick={onClickClose}>
                <Icon icon={closeIcon} className="icon-close" />
              </button>
            </div>
          </div>
          <div className="dates">
            <div className="title">ACQUISITION DATE</div>
            <div className="buttons">
              <Dropdown
                theme="theme-dropdown-button"
                value={weeks}
                options={WEEKS}
                onChange={(option) => {
                  setRecentImagerySettings({ weeks: option });
                  track('recentImageryDateRange');
                }}
                native
              />
              <div className="before">before</div>
              <Datepicker
                date={date ? moment(date) : moment()}
                handleOnDateChange={(d) => {
                  setRecentImagerySettings({ date: d.format('YYYY-MM-DD') });
                  track('recentImageryDate');
                }}
                settings={{
                  minDate: '2013-01-01',
                  maxDate: moment().format('YYYY-MM-DD'),
                  hideKeyboardShortcutsPanel: true,
                  noBorder: true,
                  readOnly: true,
                  displayFormat: 'D MMM YYYY',
                  isOutsideRange: (d) =>
                    d.isAfter(moment()) || d.isBefore(moment('2000-01-01')),
                  block: true,
                  placement: 'left',
                }}
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
                track('recentImageryClouds');
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
          {tiles && !!tiles.length && (
            <Fragment>
              <div key="thumbnails-header" className="header">
                <div className="description">
                  <p>
                    {moment(selected.dateTime)
                      .format('DD MMM YYYY')
                      .toUpperCase()}
                  </p>
                  <p>
                    {format('.0f')(selected.cloudScore)}
                    % cloud coverage
                  </p>
                  <p>{startCase(selected.instrument)}</p>
                </div>
                <Dropdown
                  className="band-selector"
                  theme="theme-dropdown-button"
                  value={bands}
                  options={BANDS}
                  onChange={(option) => {
                    resetRecentImageryData();
                    setRecentImagerySettings({
                      bands: option === '0' ? 0 : option,
                      selected: null,
                      selectedIndex: 0,
                    });
                    track('recentImageryImageType');
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
                track('refetchDataBtn', {
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
          {loading && !error && (!tiles || !tiles.length) && (
            <Loader className="placeholder" />
          )}
        </div>
      </div>
    );
  }
}

RecentImagerySettings.propTypes = {
  activeTile: PropTypes.object,
  tiles: PropTypes.array,
  settings: PropTypes.object,
  setRecentImagerySettings: PropTypes.func,
  setRecentImageryLoading: PropTypes.func,
  setModalMetaSettings: PropTypes.func,
  resetRecentImageryData: PropTypes.func,
  loading: PropTypes.bool,
  onClickClose: PropTypes.func,
  error: PropTypes.bool,
};

export default RecentImagerySettings;
