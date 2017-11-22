import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

class WidgetStories extends PureComponent {
  render() {
    const {
      isLoading,
      countryData,
      topRegions,
      totalAmount,
      percentage,
      startYear,
      endYear,
      countryRegions,
      countryRegion
    } = this.props;
    return (
      <div className="c-widget-stories" id="c-widget-stories">
        <div className="c-widget-stories__container">
          <div className="row">
            <div className="columns c-widget-stories__primary-info">
              <h2>
                {countryRegion === 0
                  ? countryData.name
                  : countryRegions[countryRegion - 1].name}{' '}
                Stories
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
            <div className="columns c-widget-stories__secondary-info">
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

WidgetStories.propTypes = {};

export default WidgetStories;
