import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-forestry-employment-actions';
import reducers, { initialState } from './widget-forestry-employment-reducers';
import { charData, getSentence } from './widget-forestry-employment-selectors';
import WidgetForestryEmploymentComponent from './widget-forestry-employment-component';

const mapStateToProps = ({ widgetForestryEmployment }, ownProps) => {
  const { data, settings } = widgetForestryEmployment;
  const { colors, locationNames } = ownProps;
  const selectorData = {
    data,
    settings,
    locationNames,
    colors: colors.employment
  };

  return {
    charData: charData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetForestryEmploymentContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getForestryEmployment } = this.props;
    getForestryEmployment({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, getForestryEmployment, location } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getForestryEmployment({
        ...location,
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetForestryEmploymentComponent, {
      ...this.props
    });
  }
}

WidgetForestryEmploymentContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getForestryEmployment: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetForestryEmploymentContainer
);
