import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-fao-cover-actions';
import reducers, { initialState } from './widget-fao-cover-reducers';
import { getFAOCoverData, getSentence } from './widget-fao-cover-selectors';
import WidgetFAOCoverComponent from './widget-fao-cover-component';

const mapStateToProps = ({ widgetFAOCover }, ownProps) => {
  const { data } = widgetFAOCover;
  const { locationNames } = ownProps;
  const selectorData = {
    data,
    locationNames,
    colors: ownProps.colors.extent
  };
  return {
    data: getFAOCoverData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetFAOCoverContainer extends PureComponent {
  componentWillMount() {
    const { location, getFAOCover } = this.props;
    getFAOCover({ ...location });
  }

  componentWillReceiveProps(nextProps) {
    const { location, getFAOCover } = nextProps;

    if (!isEqual(location, this.props.location)) {
      getFAOCover({ ...location });
    }
  }

  render() {
    return createElement(WidgetFAOCoverComponent, {
      ...this.props
    });
  }
}

WidgetFAOCoverContainer.propTypes = {
  location: PropTypes.object.isRequired,
  getFAOCover: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetFAOCoverContainer);
