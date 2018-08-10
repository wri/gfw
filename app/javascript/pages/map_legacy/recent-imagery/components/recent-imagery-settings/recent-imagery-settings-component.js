import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Icon from 'components/ui/icon';
import Slider from 'components/ui/slider';
import Carousel from 'components/ui/carousel';
import Dropdown from 'components/ui/dropdown';
import Datepicker from 'components/ui/datepicker';
import NoContent from 'components/ui/no-content';

import WEEKS from 'data/weeks.json';
import draggerIcon from 'assets/icons/dragger.svg';
import closeIcon from 'assets/icons/close.svg';
import RecentImageryDrag from './recent-imagery-settings-drag';
import './recent-imagery-settings-styles.scss';

import RecentImageryThumbnail from '../recent-imagery-thumbnail';

class RecentImagerySettings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailsDescription: null
    };
  }

  render() {
    const {
      selectedTile,
      tiles,
      settings: {
        styles,
        thumbsToShow,
        selectedTileSource,
        date,
        weeks,
        clouds
      },
      isDragging,
      connectDragSource,
      setRecentImagerySettings,
      setRecentImageryShowSettings
    } = this.props;
    let opacity = 1;

    if (isDragging) {
      opacity = 0;
    }

    return connectDragSource(
      <div className="c-recent-imagery-settings" style={{ ...styles, opacity }}>
        <Icon icon={draggerIcon} className="dragger-icon" />
        <button
          className="close-btn"
          onClick={() => setRecentImageryShowSettings(false)}
        >
          <Icon icon={closeIcon} className="close-icon" />
        </button>
        <div className="c-recent-imagery-settings__title">
          RECENT HI-RES SATELLITE IMAGERY
        </div>
        <div className="c-recent-imagery-settings__dates">
          <div className="c-recent-imagery-settings__dates__title">
            ACQUISITION DATE
          </div>
          <div className="c-recent-imagery-settings__dates__buttons">
            <Dropdown
              theme="theme-dropdown-button"
              value={weeks}
              options={WEEKS}
              onChange={option =>
                setRecentImagerySettings({ weeks: option.value })
              }
            />
            <div className="c-recent-imagery-settings__dates__before">
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
        <div className="c-recent-imagery-settings__clouds">
          <div className="c-recent-imagery-settings__clouds__title">
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
        <div className="c-recent-imagery-settings__thumbnails">
          {tiles.length >= 1 && (
            <div>
              <div className="c-recent-imagery-settings__thumbnails__description">
                {this.state.thumbnailsDescription ||
                  (selectedTile && selectedTile.description)}
              </div>
              <Carousel
                settings={{
                  slidesToShow: thumbsToShow,
                  infinite: false,
                  centerMode: false,
                  centerPadding: '20px',
                  dots: false,
                  arrows: tiles.length > thumbsToShow,
                  responsive: [
                    {
                      breakpoint: 620,
                      settings: {
                        slidesToShow: thumbsToShow - 2
                      }
                    }
                  ]
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
                          thumbnailsDescription: tile.description
                        });
                      }}
                      handleMouseLeave={() => {
                        this.setState({ thumbnailsDescription: null });
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          )}
          {tiles.length < 1 && (
            <NoContent
              className="c-recent-imagery-settings__empty-thumbnails"
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
  tiles: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  setRecentImagerySettings: PropTypes.func.isRequired,
  setRecentImageryShowSettings: PropTypes.func.isRequired
};

export default RecentImageryDrag(RecentImagerySettings);
