import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setMapSettings } from 'components/map/map-actions';
import { getBasemap, getLabels } from 'components/map/map-selectors';
import BasemapsComponent from './basemaps-component';

function mapStateToProps(state) {
  return {
    activeBasemap: getBasemap(state.location),
    activeLabels: getLabels(state.location)
  };
}

class BasemapsContainer extends React.Component {
  static propTypes = {
    setMapSettings: PropTypes.func.isRequired
  };

  selectBasemap = basemap => this.props.setMapSettings({ basemap });

  selectLabels = label => this.props.setMapSettings({ label });

  render() {
    return (
      <BasemapsComponent
        {...this.props}
        selectBasemap={this.selectBasemap}
        selectLabels={this.selectLabels}
      />
    );
  }
}

const ConnectedBasemaps = connect(mapStateToProps, { setMapSettings })(
  BasemapsContainer
);

export default React.forwardRef((props, ref) => (
  <ConnectedBasemaps {...props} fowardedRef={ref} />
));
