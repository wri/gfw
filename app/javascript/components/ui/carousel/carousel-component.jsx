import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SlickSlider from 'react-slick';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import arrowIcon from 'assets/icons/arrow-down.svg';
import { SCREEN_M } from 'utils/constants';

import './carousel-styles.scss';

const defaultSettings = {
  dots: false,
  speed: 500,
  infinite: false,
  slidesToShow: 2,
  slidesToScroll: 1,
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

class Carousel extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className, children, settings } = this.props;
    const sliderSettings = {
      ...defaultSettings,
      ...settings
    };

    return (
      <div className={`c-carousel ${className || ''}`}>
        <SlickSlider {...sliderSettings}>{children}</SlickSlider>
      </div>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  settings: PropTypes.object,
  className: PropTypes.string
};

export default Carousel;
