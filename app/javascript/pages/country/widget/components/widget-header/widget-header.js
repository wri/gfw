import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

import WidgetHeaderComponent from './widget-header-component';
import actions from './widget-header-actions';

export { initialState } from './widget-header-reducers';
export { default as reducers } from './widget-header-reducers';
export { default as actions } from './widget-header-actions';

const EMBED_URL = `${process.env.GFW_URL}/country/embed/{widget}/{location}`;

const mapStateToProps = (state, widgetHeader) => ({
  location: state.location,
  widget: widgetHeader.widget
});

class WidgetHeaderContainer extends PureComponent {
  openShare = () => {
    const { location, widget, setShareData, title, locationNames } = this.props;

    setShareData({
      isOpen: true,
      haveEmbed: true,
      data: {
        title: 'Share this widget',
        subtitle: `${title} in ${
          locationNames.current ? locationNames.current.label : ''
        }`,
        url: window.location.href,
        embedUrl: EMBED_URL.replace('{widget}', widget).replace(
          '{location}',
          `${location.payload.country}${
            location.payload.region ? `/${location.payload.region}` : ''
          }${
            location.payload.subRegion ? `/${location.payload.subRegion}` : ''
          }${
            location.query[widget] ? `?${widget}=${location.query[widget]}` : ''
          }`
        ),
        embedSettings:
          WIDGETS_CONFIG[widget].gridWidth === 6
            ? { width: 315, height: 460 }
            : { width: 670, height: 490 }
      }
    });
  };

  render() {
    return createElement(WidgetHeaderComponent, {
      ...this.props,
      openShare: this.openShare
    });
  }
}

WidgetHeaderContainer.propTypes = {
  location: PropTypes.object.isRequired,
  widget: PropTypes.string.isRequired,
  setShareData: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  locationNames: PropTypes.object.isRequired
};

export default connect(mapStateToProps, actions)(WidgetHeaderContainer);
