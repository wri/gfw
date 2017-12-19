import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import EmbedComponent from './embed-component';

const mapStateToProps = ({ location, countryData }) => ({
  widgetKey: location.payload.widget,
  isGeostoreLoading: countryData.isGeostoreLoading
});

class EmbedContainer extends PureComponent {
  render() {
    return createElement(EmbedComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps)(EmbedContainer);
