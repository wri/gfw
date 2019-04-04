import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import PromptTour from 'components/prompts/components/prompt-tour';

import exploreGreenIcon from 'assets/icons/explore-green.svg';
import analysisGreenIcon from 'assets/icons/analysis-green.svg';

import './styles.scss';

class MapTour extends PureComponent {
  componentDidUpdate(prevProps) {
    const { open } = this.props;
    if (open && open !== prevProps.open) {
      this.resetMapLayout();
    }
  }

  renderExitOptions = () => (
    <div className="tour-exit-actions">
      <p className="intro">
        Not sure what to do next? Here are some suggestions:
      </p>
      <Button
        className="guide-btn"
        theme="theme-button-clear theme-button-dashed"
        onClick={() => {
          this.props.setExploreView();
          this.props.setMapTourOpen(false);
          track('welcomeModal', { label: 'topics' });
        }}
      >
        <Icon className="guide-btn-icon" icon={exploreGreenIcon} />
        <p>
          Try out the Explore tab for an introduction to key forest topics and
          high priority areas with recent forest loss.
        </p>
      </Button>
      <Button
        className="guide-btn"
        theme="theme-button-clear theme-button-dashed"
        onClick={() => {
          this.props.setAnalysisView();
          this.props.setMapTourOpen(false);
          track('welcomeModal', { label: 'Analysis' });
        }}
      >
        <Icon className="guide-btn-icon" icon={analysisGreenIcon} />
        <p>Test out our new and improved analysis features.</p>
      </Button>
    </div>
  );

  getSteps = () => {
    const { setMainMapSettings, setMenuSettings } = this.props;

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
        content:
          'View and change settings for data layers on the map like date range and opacity. Click the "i" icons to learn more about a dataset.',
        actions: {
          next: () => {
            setMainMapSettings({
              showAnalysis: true
            });
          },
          prev: () => {
            setMainMapSettings({
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
            'Analyze forest change within your area of interest by clicking a shape on the map or drawing or uploading a shape.',
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
              menuSection: ''
            });
          }
        }
      },
      {
        target: '.map-tour-menu-panel',
        placement: 'right',
        content: {
          text: 'Search for a dataset, location or geographic coordinates.',
          next: () => {
            setMenuSettings({
              menuSection: ''
            });
            setMainMapSettings({
              showBasemaps: true
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
        target: '.map-tour-basemaps',
        content: {
          text:
            'Customize the basemap, including the boundaries displayed and the color of the labels.',
          next: () => {
            setMainMapSettings({
              showBasemaps: false
            });
          },
          prev: () => {
            setMenuSettings({
              menuSection: 'search'
            });
            setMainMapSettings({
              showBasemaps: false
            });
          }
        }
      },
      {
        target: '.map-tour-recent-imagery',
        content: {
          text:
            'View recent satellite imagery, searchable by date and cloud cover.',
          prev: () => {
            setMainMapSettings({
              showBasemaps: true
            });
          }
        }
      },
      {
        target: '.map-tour-map-controls',
        content:
          'Access basic map tools: zoom out and in, expand the map, share or embed, print, and take a tour of the map. Also view zoom level and lat/long coordinates.'
      },
      {
        target: '.map-tour-main-menu',
        content: 'Access the main navigation menu.'
      },
      {
        target: 'body',
        content: this.renderExitOptions
      }
    ];
  };

  resetMapLayout = () => {
    const { setMainMapSettings, setMenuSettings } = this.props;
    setMainMapSettings({ showAnalysis: false });
    setMenuSettings({ menuSection: '' });
  };

  // renderTooltip = (
  //   { closeProps, backProps, content, primaryProps, isLastStep, index },
  //   numOfSteps
  // ) => {
  //   let prevOnClick = backProps && backProps.onClick;
  //   let nextOnClick = primaryProps && primaryProps.onClick;
  //   let html = content;
  //   if (typeof content === 'object') {
  //     html = content.text;
  //     prevOnClick = e => {
  //       if (content.prev) {
  //         content.prev();
  //       }
  //       setTimeout(() => backProps.onClick(e), 400);
  //     };
  //     nextOnClick = e => {
  //       if (content.next) {
  //         content.next();
  //       }
  //       setTimeout(() => primaryProps.onClick(e), 400);
  //     };
  //   }
  //   return (
  //     <div className="c-tour-tooltip">
  //       <button className="tour-close" {...closeProps}>
  //         <Icon icon={closeIcon} />
  //       </button>
  //       <div className="tour-step">
  //         {index + 1}/{numOfSteps}
  //       </div>
  //       <div className="tour-content">
  //         {typeof html === 'function' ? html() : html}
  //       </div>
  //       <div className="tour-btns">
  //         {index !== 0 && (
  //           <Button
  //             theme="theme-button-light"
  //             {...backProps}
  //             onClick={prevOnClick}
  //           >
  //             Prev
  //           </Button>
  //         )}
  //         {isLastStep ? (
  //           <Button {...closeProps}>Finish</Button>
  //         ) : (
  //           <Button {...primaryProps} onClick={nextOnClick}>
  //             Next
  //           </Button>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  render() {
    const { open, setMapTourOpen } = this.props;
    const steps = this.getSteps();

    return open ? (
      <PromptTour
        title="Map tour"
        steps={steps}
        open={open}
        setTourClosed={setMapTourOpen}
      />
    ) : null;
  }
}

MapTour.propTypes = {
  open: PropTypes.bool,
  setMainMapSettings: PropTypes.func,
  setMapTourOpen: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setExploreView: PropTypes.func,
  setAnalysisView: PropTypes.func
};

export default MapTour;
