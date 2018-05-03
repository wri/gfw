import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Widget from './components/widget';

import './styles.scss';

class Widgets extends PureComponent {
  render() {
    const {
      loading,
      currentLocation,
      widgets,
      activeWidget,
      category,
      WidgetsFuncs
    } = this.props;

    return (
      <div className="c-widgets">
        {loading && <Loader className="widgets-loader large" />}
        {!loading &&
          currentLocation &&
          widgets &&
          widgets.length > 0 &&
          widgets.map(widget => (
            <Widget
              {...this.props}
              key={widget.name}
              widget={widget.name}
              active={activeWidget && activeWidget.name === widget.name}
              {...WidgetsFuncs[widget.name]}
            />
          ))}
        {!loading &&
          (!currentLocation || (!widgets || widgets.length === 0)) && (
            <NoContent
              className="no-widgets-message large"
              message={
                currentLocation
                  ? `${upperFirst(category)} data for ${
                    currentLocation
                  } coming soon`
                  : 'Please select a country'
              }
              icon
            />
          )}
      </div>
    );
  }
}

Widgets.propTypes = {
  loading: PropTypes.bool,
  currentLocation: PropTypes.string,
  widgets: PropTypes.array,
  activeWidget: PropTypes.string,
  category: PropTypes.string,
  WidgetsFuncs: PropTypes.object
};

export default Widgets;
