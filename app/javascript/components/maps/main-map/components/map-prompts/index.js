import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setMainMapSettings } from 'components/maps/main-map/actions';
import { setMapSettings } from 'components/maps/map/actions';
import { setMenuSettings } from 'components/maps/components/menu/menu-actions';

import * as actions from './actions';
import Component from './component';
import { getMapPromptsProps } from './selectors';

class MapPromptsContainer extends PureComponent {
  componentDidUpdate(prevProps) {
    const { open } = this.props;
    if (open && open !== prevProps.open) {
      this.resetMapLayout();
    }
  }

  getStepsData = () => {
    const { stepsKey } = this.props;
    const { setMapPromptsSettings } = this.props;

    const allSteps = {
      mapTour: {
        title: 'Map tour',
        steps: [
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
                this.props.setMainMapSettings({
                  showAnalysis: true
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
                this.props.setMenuSettings({
                  menuSection: 'explore'
                });
              },
              prev: () => {
                this.props.setMainMapSettings({
                  showAnalysis: false
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
                this.props.setMenuSettings({
                  menuSection: 'search'
                });
              },
              prev: () => {
                this.props.setMenuSettings({
                  menuSection: ''
                });
              }
            }
          },
          {
            target: '.map-tour-menu-panel',
            placement: 'right',
            content:
              'Search for a dataset, location or geographic coordinates.',
            actions: {
              next: () => {
                this.props.setMenuSettings({
                  menuSection: ''
                });
                this.props.setMainMapSettings({
                  showBasemaps: true
                });
              },
              prev: () => {
                this.props.setMenuSettings({
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
                this.props.setMainMapSettings({
                  showBasemaps: false
                });
              },
              prev: () => {
                this.props.setMenuSettings({
                  menuSection: 'search'
                });
                this.props.setMainMapSettings({
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
                this.props.setMainMapSettings({
                  showBasemaps: true
                });
              },
              learnHow: () => {
                setMapPromptsSettings({
                  open: true,
                  stepsKey: 'recentImageryTour',
                  stepIndex: 0
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
          }
        ]
      },
      recentImagery: {
        title: 'Recent Satellite Imagery',
        steps: [
          {
            target: '.recent-imagery-btn',
            content:
              'Display recent satellite imagery over an area, filtered by date and cloud cover.',
            disableBeacon: true,
            actions: {
              learnHow: () => {
                setMapPromptsSettings({
                  open: true,
                  stepsKey: 'recentImageryTour',
                  stepIndex: 0
                });
              }
            }
          }
        ],
        settings: {
          disableOverlay: true
        }
      },
      recentImageryTour: {
        title: 'Recent Satellite Imagery',
        steps: [
          {
            target: '.recent-imagery-btn',
            content:
              'Click the Satellite icon to overlay a satellite tile at the center of the map, beneath the crosshair icon.',
            disableBeacon: true
          },
          {
            target: '.recent-imagery-btn',
            content:
              'The map will automatically fetch the most recent satellite image with the least amount of cloud cover for your targeted area.',
            disableBeacon: true
          },
          {
            target: '.recent-imagery-btn',
            content:
              'Change the settings like the Acquisition Date and Cloud Cover Percentage to filter the available images. Click on a thumbnail to overlay that image on the map. They are ordered by date (most recent first). You can see the date of an image by hovering over it.',
            disableBeacon: true
          },
          {
            target: '.recent-imagery-btn',
            content:
              'Move the crosshair icon on the map outside of the image to load a new tile in a different area.',
            disableBeacon: true
          }
        ],
        settings: {
          disableOverlay: true
        }
      }
    };

    return allSteps[stepsKey];
  };

  resetMapLayout = () => {
    this.props.setMainMapSettings({ showAnalysis: false });
    this.props.setMenuSettings({ menuSection: '' });
  };

  render() {
    return createElement(Component, {
      ...this.props,
      data: this.getStepsData()
    });
  }
}

MapPromptsContainer.propTypes = {
  open: PropTypes.bool,
  setMainMapSettings: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setMapPromptsSettings: PropTypes.func,
  stepsKey: PropTypes.string
};

export default connect(getMapPromptsProps, {
  ...actions,
  setMainMapSettings,
  setMenuSettings,
  setMapSettings
})(MapPromptsContainer);
