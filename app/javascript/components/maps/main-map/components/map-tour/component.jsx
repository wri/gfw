import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import PromptTour from 'components/prompts';

import exploreGreenIcon from 'assets/icons/explore-green.svg';
import analysisGreenIcon from 'assets/icons/analysis-green.svg';

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
        content:
          'Analyze forest change within your area of interest by clicking a shape on the map or drawing or uploading a shape.',
        actions: {
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
        content:
          'Explore data related to important forest topics, Places to Watch (high priority areas with recent forest loss), and stories about forests.',
        actions: {
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
        content: 'Search for a dataset, location or geographic coordinates.',
        actions: {
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
        content:
          'Customize the basemap, including the boundaries displayed and the color of the labels.',
        actions: {
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
        content:
          'View recent satellite imagery, searchable by date and cloud cover.',
        actions: {
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
        content: () => this.renderExitOptions()
      }
    ];
  };

  resetMapLayout = () => {
    const { setMainMapSettings, setMenuSettings } = this.props;
    setMainMapSettings({ showAnalysis: false });
    setMenuSettings({ menuSection: '' });
  };

  render() {
    const {
      open,
      stepIndex,
      stepsKey,
      data,
      setMapTourOpen,
      setMapPromptsSettings
    } = this.props;

    return open && data ? (
      <PromptTour
        title={data.title}
        steps={data.steps}
        open={open}
        stepIndex={stepIndex}
        setTourClosed={setMapTourOpen}
        handleStateChange={state =>
          setMapPromptsSettings({ stepsKey, ...state })
        }
        settings={data.settings}
      />
    ) : null;
  }
}

MapTour.propTypes = {
  open: PropTypes.bool,
  stepIndex: PropTypes.number,
  stepsKey: PropTypes.string,
  data: PropTypes.object,
  setMapPromptsSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
  setMapTourOpen: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setExploreView: PropTypes.func,
  setAnalysisView: PropTypes.func
};

export default MapTour;
