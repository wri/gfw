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
      colors,
      widget,
      embed,
      minimalist
    } = this.props;

    return widget && embed ? (
      <Widget
        {...this.props}
        widget={widget.name}
        colors={colors[widget.config.colors || widget.config.type] || colors}
      />
    ) : (
      <div
        className={`c-widgets ${embed ? 'embed' : ''} ${
          minimalist ? 'minimalist' : ''
        }`}
      >
        {loading && <Loader className="widgets-loader large" />}
        {!loading &&
          widgets &&
          widgets.length > 0 &&
          widgets.map(w => (
            <Widget
              {...this.props}
              key={w.name}
              widget={w.name}
              active={activeWidget && activeWidget === w.name}
              colors={colors[w.config.colors || w.config.type] || colors}
            />
          ))}
        {!loading &&
          (!widgets || widgets.length === 0) && (
            <NoContent
              className="no-widgets-message large"
              message={`${upperFirst(category)} data for ${currentLabel ||
                'global'} coming soon`}
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
  widget: PropTypes.object,
  embed: PropTypes.bool,
  minimalist: PropTypes.bool,
  activeWidget: PropTypes.string,
  category: PropTypes.string,
  WidgetsFuncs: PropTypes.object,
  colors: PropTypes.object
};

export default Widgets;
