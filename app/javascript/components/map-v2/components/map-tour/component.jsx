import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';

import './styles.scss';

class MapTour extends PureComponent {
  componentDidUpdate(prevProps) {
    const { open } = this.props;
    if (open && open !== prevProps.open) {
      this.resetMapLayout();
    }
  }

  getSteps = () => {
    const { setAnalysisSettings, setMenuSettings } = this.props;

    return [
      {
        target: '.map-tour-data-layers',
        content: 'Explore available data layers',
        disableBeacon: true,
        placement: 'right'
      },
      {
        target: '.map-tour-legend',
        placement: 'right',
        content: {
          text:
            'View and change settings for data layers on the map like date range and opacity. Click the "i" icons to learn more about a dataset.',
          next: () => {
            setAnalysisSettings({
              showAnalysis: true
            });
          },
          prev: () => {
            setAnalysisSettings({
              showAnalysis: false
            });
          }
        }
      },
      {
        target: '.map-tour-legend',
        placement: 'right',
        content: {
          text:
            'Analyze forest change within your area of interest by clicking a shape on the map or drawing or uploading shape.',
          next: () => {
            setMenuSettings({
              menuSection: 'explore'
            });
          },
          prev: () => {
            setMenuSettings({
              menuSection: ''
            });
          }
        }
      },
      {
        target: '.map-tour-menu-panel',
        placement: 'right',
        content: {
          text:
            'Explore data related to important forest topics, Places to Watch (high priority areas with recent forest loss), and stories about forests.',
          next: () => {
            setMenuSettings({
              menuSection: 'search'
            });
          },
          prev: () => {
            setMenuSettings({
              menuSection: 'explore'
            });
          }
        }
      },
      {
        target: '.map-tour-menu-panel',
        placement: 'right',
        content: {
          text: 'Search for a datasets, location or geographic coordinates.',
          next: () => {
            setMenuSettings({
              menuSection: 'search'
            });
          },
          prev: () => {
            setMenuSettings({
              menuSection: ''
            });
          }
        }
      },
      {
        target: '.map-tour-basemaps',
        content: {
          text:
            'Customize the basemap, including the boundaries displayed and the color of the labels.',
          next: () => {},
          prev: () => {
            setMenuSettings({
              menuSection: 'search'
            });
          }
        }
      },
      {
        target: '.map-tour-recent-imagery',
        content:
          'View recent satellite imagery, search by date and cloud cover.'
      },
      {
        target: '.map-tour-map-controls',
        content:
          'Access basic map tools and information: zoom in/out share, expand, zoom level, lat/long, and coordinates.'
      },
      {
        target: '.map-tour-main-menu',
        content: 'Access the main navigation menu.'
      }
    ];
  };

  resetMapLayout = () => {
    const { setAnalysisSettings, setMenuSettings } = this.props;
    setAnalysisSettings({ showAnalysis: false });
    setMenuSettings({ menuSection: '' });
  };

  renderTooltip = ({
    closeProps,
    backProps,
    content,
    primaryProps,
    skipProps,
    isLastStep,
    index
  }) => {
    let prevOnClick = backProps && backProps.onClick;
    let nextOnClick = primaryProps && primaryProps.onClick;
    let html = content;
    if (typeof content === 'object') {
      html = content.text;
      prevOnClick = e => {
        content.prev();
        setTimeout(() => backProps.onClick(e), 300);
      };
      nextOnClick = e => {
        content.next();
        setTimeout(() => primaryProps.onClick(e), 300);
      };
    }
    return (
      <div className="c-tour-tooltip">
        <button className="tour-close" {...closeProps}>
          <Icon icon={closeIcon} />
        </button>
        <div className="tour-step">{index + 1}</div>
        <div className="tour-content">{html}</div>
        <div className="tour-btns">
          {index !== 0 && (
            <Button
              theme="theme-button-light"
              {...backProps}
              onClick={prevOnClick}
            >
              Prev
            </Button>
          )}
          {isLastStep ? (
            <Button {...skipProps}>Finish</Button>
          ) : (
            <Button {...primaryProps} onClick={nextOnClick}>
              Next
            </Button>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { open, setMapTourOpen } = this.props;

    return (
      <Joyride
        steps={this.getSteps()}
        run={open}
        continuous
        callback={data => {
          if (data.action === 'close' || data.type === 'tour:end') {
            setMapTourOpen(false);
          }
        }}
        tooltipComponent={this.renderTooltip}
        styles={{
          options: {
            overlayColor: 'rgba(17, 55, 80, 0.4)',
            zIndex: 1000
          }
        }}
      />
    );
  }
}

MapTour.propTypes = {
  open: PropTypes.bool,
  setAnalysisSettings: PropTypes.func,
  setMapTourOpen: PropTypes.func,
  setMenuSettings: PropTypes.func
};

export default MapTour;
