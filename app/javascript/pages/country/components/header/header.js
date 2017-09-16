import { createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import HeaderComponent from './header-component';
import actions from './header-actions';

export { initialState } from './header-reducers';
export { default as reducers } from './header-reducers';
export { default as actions } from './header-actions';

const mapStateToProps = state => ({
  iso: state.root.iso,
  countriesList: state.root.countriesList,
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions
});

const HeaderContainer = (props) => {
  const selectCountry = (iso) => {
    const { history } = props;

    history.push(`/country/${iso}`);
    props.setInitialState();
  };

  const selectRegion = (region) => {
    const { iso, history } = props;

    history.push(`/country/${iso}/${region}`);
  };

  return createElement(HeaderComponent, {
    ...props,
    selectCountry,
    selectRegion
  });
};

export default withRouter(connect(mapStateToProps, actions)(HeaderContainer));
