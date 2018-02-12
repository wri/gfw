import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './stories-styles.scss';

class WidgetStories extends PureComponent {
  render() {
    const { locationNames } = this.props;
    return (
      <div className="c-stories" id="c-stories">
        <div className="stories-panels">
          <div className="left-panel">
            <div className="primary-stories">
              <h2>
                {locationNames.country && locationNames.country.label} Stories
              </h2>
              <div className="container-titles">
                <p>
                  When Tree Cover Loss is Really Forest Loss: New Plantation
                  Mpas{' '}
                </p>
                <p>New Plantation Mpas Improve Fores</p>
              </div>
              <p className="description">
                Thousands of people around the world use GFW every day to
                monitor and manage forests, stop illegal deforestation and
                fires, call out unsustainable activities, defend their land and
                resources, sustainably source commodities, and conduct research
                at the forefront of conservation.
              </p>
              <a className="link" href="">
                See more on the map
              </a>
            </div>
          </div>
          <div className="right-panel">
            <div className="secondary-stories">
              <div className="circle" />
              <h3>Stories</h3>
              <p className="title-name">Claire Salisbury</p>
              <p className="description">
                Keeping Amazon Fish connected is key to their conservation
              </p>
              <a className="link" href="">
                See more on the map
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WidgetStories.propTypes = {
  locationNames: PropTypes.object.isRequired
};

export default WidgetStories;
