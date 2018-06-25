import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import CountriesComponent from './countries-component';

const mapStateToProps = () => ({});

class CountriesContainer extends PureComponent {
  render() {
    return createElement(CountriesComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, null)(CountriesContainer);
