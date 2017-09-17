import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class WidgetTreeCover extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const { isLoading } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-cover">

        </div>
      )
    }
  }
}

WidgetTreeCover.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  iso: PropTypes.string.isRequired,
  countryRegion: PropTypes.number.isRequired,
  setInitialData: PropTypes.func.isRequired
};

export default WidgetTreeCover;
