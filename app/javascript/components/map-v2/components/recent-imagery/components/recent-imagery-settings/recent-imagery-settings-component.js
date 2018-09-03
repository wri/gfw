import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { format } from 'd3-format';

import Icon from 'components/ui/icon';
import Slider from 'components/ui/slider-old';
import Carousel from 'components/ui/carousel';
import Dropdown from 'components/ui/dropdown';
import Datepicker from 'components/ui/datepicker';
import NoContent from 'components/ui/no-content';

import WEEKS from 'data/weeks.json';
import BANDS from 'data/bands.json';
import closeIcon from 'assets/icons/close.svg';

import RecentImageryThumbnail from '../recent-imagery-thumbnail';

import './recent-imagery-settings-styles.scss';

class RecentImagerySettings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  render() {
    const {
      selectedTile,
      tiles,
      settings: {
        selectedTileSource,
        date,
        weeks,
        clouds,
        bands
      },
      setRecentImagerySettings,
      onClose,
      getTooltipContentProps,
      setMapSettings,
      datasets
    } = this.props;
    console.log(this.props);
    const selected = this.state.selected || selectedTile;

    return (
      <div className="c-recent-imagery-settings" {...getTooltipContentProps()}>
        <div className="top-section">
          <div className="recent-menu">
            <div className="title">Recent satellite imagery</div>
            <button
              className="close-btn"
              onClick={() => onClose(false)}
            >
              <Icon icon={closeIcon} className="icon-close" />
            </button>
          </div>
          <div className="dates">
            <div className="title">
              ACQUISITION DATE
            </div>
            <div className="buttons">
              <Dropdown
                theme="theme-dropdown-button"
                value={weeks}
                options={WEEKS}
                onChange={option =>
                  setRecentImagerySettings({ weeks: option.value })
                }
              />
              <div className="before">
                before
              </div>
              <Datepicker
                date={date ? moment(date) : moment()}
                handleOnDateChange={d =>
                  setRecentImagerySettings({ date: d.format('YYYY-MM-DD') })
                }
                settings={{
                  displayFormat: 'D MMM YYYY',
                  numberOfMonths: 1,
                  isOutsideRange: d => d.isAfter(moment()),
                  hideKeyboardShortcutsPanel: true,
                  noBorder: true,
                  readOnly: true
                }}
              />
            </div>
          </div>
          <div className="clouds">
            <div className="title">
              MAXIMUM CLOUD COVER PERCENTAGE
            </div>
            <Slider
              className="theme-slider-green"
              settings={{
                defaultValue: clouds,
                marks: {
                  0: '0%',
                  25: '25%',
                  50: '50%',
                  75: '75%',
                  100: '100%'
                },
                marksOnTop: true,
                step: 5,
                dots: true,
                tipFormatter: value => `${value}%`
              }}
              handleOnSliderChange={d => setRecentImagerySettings({ clouds: d })}
            />
          </div>
        </div>
        <div className="thumbnails">
          {!!tiles.length && [
            <div
              key="thumbnails-header"
              className="header"
            >
              <div className="description">
                <p>{moment(selected.dateTime).format('DD MMM YYYY').toUpperCase()}</p>
                <p>{format('.0f')(selected.cloudScore)}% cloud coverage</p>
                <p>{selected.instrument}</p>
              </div>
              <Dropdown
                className="band-selector"
                theme="theme-dropdown-button"
                value={bands}
                options={BANDS}
                onChange={option =>
                  setRecentImagerySettings({ bands: option.value })
                }
              />
            </div>,
            <Carousel
              key="thumbnails-carousel"
              settings={{
                slidesToShow: 1,
                centerPadding: '75px',
                dots: false,
                arrows: tiles.length > 1
              }}
            >
              {tiles.map((tile, i) => (
                <div key={`recent-imagery-thumb-${tile.id}`}>
                  <RecentImageryThumbnail
                    id={i}
                    tile={tile}
                    selected={selectedTileSource === tile.id}
                    handleClick={() => {
                      setRecentImagerySettings({
                        selectedTileSource: tile.id
                      });
                    }}
                    handleMouseEnter={() => {
                      this.setState({
                        selected: tile
                      });
                    }}
                    handleMouseLeave={() => {
                      this.setState({ selected: null });
                    }}
                  />
                </div>
              ))}
            </Carousel>
          ]}
          {!tiles.length && (
            <NoContent
              className="empty-thumbnails"
              message="We can't find additional images for the selection"
            />
          )}
        </div>
      </div>
    );
  }
}

RecentImagerySettings.propTypes = {
  selectedTile: PropTypes.object,
  tiles: PropTypes.array,
  settings: PropTypes.object,
  setRecentImagerySettings: PropTypes.func,
  onClose: PropTypes.func,
  getTooltipContentProps: PropTypes.func
};

export default RecentImagerySettings;
