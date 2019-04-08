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

    const allSteps = {
      mapTour: {
        title: 'Recent Satellite Imagery',
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
              },
              prev: () => {
                this.props.setMainMapSettings({
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
                this.props.setMenuSettings({
                  menuSection: 'explore'
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
        ]
      },
      recentImagery: {
        title: 'Recent Satellite Imagery',
        steps: [
          {
            target: '.map-tour-data-layers',
            content:
              'Display recent satellite imagery over an area, filtered by date and cloud cover.',
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
  stepsKey: PropTypes.string
};

export default connect(getMapPromptsProps, {
  ...actions,
  setMainMapSettings,
  setMenuSettings,
  setMapSettings
})(MapPromptsContainer);
