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
      currentLabel,
      widgets,
      activeWidget,
      category,
      colors
    } = this.props;

    return (
      <div className="c-widgets">
        {loading && <Loader className="widgets-loader large" />}
        {!loading &&
          widgets &&
          widgets.length > 0 &&
          widgets.map(widget => (
            <Widget
              {...this.props}
              key={widget.name}
              widget={widget.name}
              active={activeWidget && activeWidget.name === widget.name}
              colors={
                colors[widget.config.colors || widget.config.type] || colors
              }
            />
          ))}
        {!loading &&
          (!currentLabel || (!widgets || widgets.length === 0)) && (
            <NoContent
              className="no-widgets-message large"
              message={
                currentLabel
                  ? `${upperFirst(category)} data for ${
                    currentLabel
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
  currentLabel: PropTypes.string,
  widgets: PropTypes.array,
  activeWidget: PropTypes.object,
  category: PropTypes.string,
  WidgetsFuncs: PropTypes.object,
  colors: PropTypes.object
};

export default Widgets;
