import React, { Component } from 'react';
import { Element } from 'react-scroll';
import { lory } from 'lory.js';

import ButtonArrow from '../../../general/components/ButtonArrow';

class AboutHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slider: null,
      sliderPrevIsVisible: false,
      sliderNextIsVisible: true
    };

    this.years = [
      {
        img : "",
        title : "2001",
        paragraph : "WRI continued working to improve forest information by merging the latest technology with on-the-ground partnerships. Forest Atlases are now available for Cameroon, Central African Republic, Republic of the Congo, Democratic Republic of the Congo, Equatorial Guinea, and Gabon."
      },
      {
        img : "",
        title : "2002",
        paragraph : "WRI continued working to improve forest information by merging the latest technology with on-the-ground partnerships. Forest Atlases are now available for Cameroon, Central African Republic, Republic of the Congo, Democratic Republic of the Congo, Equatorial Guinea, and Gabon."
      },
      {
        img : "",
        title : "2003",
        paragraph : "WRI continued working to improve forest information by merging the latest technology with on-the-ground partnerships. Forest Atlases are now available for Cameroon, Central African Republic, Republic of the Congo, Democratic Republic of the Congo, Equatorial Guinea, and Gabon."
      },
      {
        img : "",
        title : "2004",
        paragraph : "WRI continued working to improve forest information by merging the latest technology with on-the-ground partnerships. Forest Atlases are now available for Cameroon, Central African Republic, Republic of the Congo, Democratic Republic of the Congo, Equatorial Guinea, and Gabon."
      }
    ];
  }

  componentDidMount() {
    /*const slider = document.querySelector('.c-about-history .js_slider');
    this.setState({
      slider: lory(slider, {
        enableMouseEvents: true,
        slideSpeed: 500
      })
    });

    slider.addEventListener('after.lory.slide', () => {
      this.checkButtonsVisibility();
    });
    slider.addEventListener('on.lory.resize', () => {
      this.checkButtonsVisibility();
    });*/
  }

  checkButtonsVisibility () {
    const currentIndex = this.state.slider.returnIndex();
    this.setState({ sliderPrevIsVisible: currentIndex !== 0 });
    this.setState({ sliderNextIsVisible: currentIndex !== this.years.length });
  };

  render() {
    const slidePrevVisibilityClass = `c-about-history__arrow-button -left ${!this.state.sliderPrevIsVisible ? '-hidden' : ''} js_slide_prev`;
    const slideNextVisibilityClass = `c-about-history__arrow-button -right ${!this.state.sliderNextIsVisible ? '-hidden' : ''} js_slide_next`;

    return (
      <Element name="history" className="c-about-history">
        <div className="row">
          <div className="small-12 columns">
            <div className="c-home-use-examples__content">
              <div className="c-about-history__title text -title-xs -color-3">HISTORY</div>
              <div className="slider js_slider">
                <div className="frame js_frame">
                  <ul className="slides js_slides">
                    {this.years.map((item, i) =>
                      <li key={i} className={`slide js_slide ${i === 0 ? 'active' : ''}`}>
                        <div className="c-about-history-item">
                          <div className="c-about-history-item__image">
                            <img src="http://bomanite.com/wp-content/uploads/2015/02/512x512-PNG-Landscape-Texture-Sunrise-Lake.jpg" />
                          </div>
                          <div className="c-about-history-item__texts">
                            <div className="c-about-history-item__title text -title -light -color-2"><span>{item.title}</span></div>
                            <div className="c-about-history-item__paragraph text -paragraph -color-2">{item.paragraph}</div>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                  <div className={slidePrevVisibilityClass}>
                    <ButtonArrow orientation="left" />
                  </div>
                  <div className={slideNextVisibilityClass}>
                    <ButtonArrow orientation={slideNextVisibilityClass} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Element>
    );
  }
}

export default AboutHistory;
