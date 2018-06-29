import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from 'components/map/map-actions';

import PageComponent from './page-component';

const mapStateToProps = ({ location, countryData }) => {
  const { lat, lng, basemap, zoom, layers, subLayers } = location.payload;
  return {
    ...location,
    ...countryData,
    mapOptions: {
      mapTypeId: basemap,
      center: { lat, lng },
      zoom
    },
    layers: layers && layers.split(',').concat(subLayers ? subLayers.split(',') : [])
  };
};

class PageContainer extends PureComponent {
  render() {
    return createElement(PageComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, actions)(PageContainer);
