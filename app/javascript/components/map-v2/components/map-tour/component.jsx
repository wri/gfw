import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tour from 'reactour';

import './styles.scss';

class MapTour extends PureComponent {
  constructor() {
    super();
    this.state = {
      forceUpdate: 'none'
    };
  }

  getSteps = () => {
    const { setAnalysisSettings, setMenuSettings } = this.props;

    return [
      {
        content:
          'Welcome to the Global Forest Watch Interactive Map. This quick guide will introduce you to the map’s main features and tools.'
      },
      {
        selector: '[data-map-tour="step-one"]',
        content: 'Explore available data layers'
      },
      {
        selector: '[data-map-tour="step-two"]',
        content:
          'View and change settings for data layers on the map like date range and opacity. Click the "i" icons to learn more about a dataset.',
        action: node => {
          node.focus();
          setAnalysisSettings({
            showAnalysis: false
          });
          this.forceUpdate('data');
        }
      },
      {
        selector: '[data-map-tour="step-two"]',
        content:
          'Analyze forest change within your area of interest by clicking a shape on the map or drawing or uploading shape.',
        action: node => {
          node.focus();
          setAnalysisSettings({
            showAnalysis: true
          });
          setMenuSettings({
            menuSection: ''
          });
          this.forceUpdate('analysis');
        }
      },
      {
        selector: '[data-map-tour="step-four"]',
        content:
          'Explore data related to important forest topics, Places to Watch (high priority areas with recent forest loss), and stories about forests.',
        action: node => {
          setMenuSettings({
            menuSection: 'explore'
          });
          setTimeout(() => node.focus(), 400);
          this.forceUpdate('explore');
        }
      },
      {
        selector: '[data-map-tour="step-four"]',
        content: 'Search for a datasets, location or geographic coordinates',
        action: node => {
          setMenuSettings({
            menuSection: 'search'
          });
          setTimeout(() => node.focus(), 400);
          this.forceUpdate('search');
        }
      },
      {
        selector: '.map-tour-basemaps',
        content:
          'Customize the basemap, including the boundaries displayed and the color of the labels.',
        action: node => {
          node.focus();
          setAnalysisSettings({
            showAnalysis: false
          });
          setMenuSettings({
            menuSection: ''
          });
          this.forceUpdate('basemaps');
        }
      },
      {
        selector: '.map-tour-recent-imagery',
        content:
          'View recent satellite imagery, search by date and cloud cover.',
        action: node => {
          node.focus();
          setAnalysisSettings({
            showAnalysis: false
          });
          setMenuSettings({
            menuSection: ''
          });
          this.forceUpdate('recent-imagery');
        }
      },
      {
        selector: '.map-tour-map-controls',
        content:
          'Access basic map tools and information: zoom in/out share, expand, zoom level, lat/long, and coordinates.',
        action: node => {
          node.focus();
          setAnalysisSettings({
            showAnalysis: false
          });
          setMenuSettings({
            menuSection: ''
          });
          this.forceUpdate('controls');
        }
      },
      {
        selector: '.map-tour-main-menu',
        content: 'Access the main navigation menu.',
        action: node => {
          node.focus();
          setAnalysisSettings({
            showAnalysis: false
          });
          setMenuSettings({
            menuSection: ''
          });
          this.forceUpdate('main-menu');
        }
      }
    ];
  };

  forceUpdate = step => {
    this.setState({ forceUpdate: step });
  };

  resetMapLayout = () => {
    const { setAnalysisSettings, setMenuSettings } = this.props;
    setAnalysisSettings({ showAnalysis: false });
    setMenuSettings({ menuSection: '' });
  };

  render() {
    const { open, setMapTourOpen } = this.props;
    return (
      <Tour
        accentColor="#97be32"
        steps={this.getSteps()}
        isOpen={open}
        onRequestClose={() => setMapTourOpen(false)}
        onAfterOpen={this.resetMapLayout}
        update={this.state.forceUpdate}
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
