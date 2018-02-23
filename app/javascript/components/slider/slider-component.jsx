import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SlickSlider from 'react-slick';
import Card from 'components/card';
import Button from 'components/button';
import Icon from 'components/icon';

import arrowIcon from 'assets/icons/arrow-down.svg';
import { SCREEN_M, SCREEN_XL } from 'utils/constants';

import './slider-styles.scss';

class Slider extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: `${
        window.innerWidth > SCREEN_XL
          ? (window.innerWidth - SCREEN_XL) / 2 - 20
          : '0'
      }px`,
      customPaging: () => <button />,
      nextArrow: (
        <Button theme="square">
          <Icon icon={arrowIcon} />
        </Button>
      ),
      prevArrow: (
        <Button theme="square">
          <Icon icon={arrowIcon} />
        </Button>
      ),
      responsive: [
        {
          breakpoint: SCREEN_M,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    };
    const { cards } = this.props;
    return (
      <div className="c-slider">
        <SlickSlider {...settings}>
          {cards &&
            cards.map(c => (
              <div key={c.id}>
                <Card key={c.title} data={c} />
              </div>
            ))}
        </SlickSlider>
      </div>
    );
  }
}

Slider.propTypes = {
  cards: PropTypes.array.isRequired
};

export default Slider;
