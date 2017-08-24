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
      sliderNextIsVisible: true,
      sliderOnMovement: false
    };

    this.years = [
      {
        img : "http://bomanite.com/wp-content/uploads/2015/02/512x512-PNG-Landscape-Texture-Sunrise-Lake.jpg",
        title : "2001",
        paragraph : "WRI continued working to improve forest information by merging the latest technology with on-the-ground partnerships. Forest Atlases are now available for Cameroon, Central African Republic, Republic of the Congo, Democratic Republic of the Congo, Equatorial Guinea, and Gabon."
      },
      {
        img : "http://bomanite.com/wp-content/uploads/2015/02/512x512-PNG-Landscape-Texture-Sunrise-Lake.jpg",
        title : "2002",
        paragraph : "WRI continued working to improve forest information by merging the latest technology with on-the-ground partnerships. Forest Atlases are now available for Cameroon, Central African Republic, Republic of the Congo, Democratic Republic of the Congo, Equatorial Guinea, and Gabon."
      },
      {
        img : "http://bomanite.com/wp-content/uploads/2015/02/512x512-PNG-Landscape-Texture-Sunrise-Lake.jpg",
        title : "2003",
        paragraph : "WRI continued working to improve forest information by merging the latest technology with on-the-ground partnerships. Forest Atlases are now available for Cameroon, Central African Republic, Republic of the Congo, Democratic Republic of the Congo, Equatorial Guinea, and Gabon."
      },
      {
        img : "http://bomanite.com/wp-content/uploads/2015/02/512x512-PNG-Landscape-Texture-Sunrise-Lake.jpg",
        title : "2004",
        paragraph : "WRI continued working to improve forest information by merging the latest technology with on-the-ground partnerships. Forest Atlases are now available for Cameroon, Central African Republic, Republic of the Congo, Democratic Republic of the Congo, Equatorial Guinea, and Gabon."
      }
    ];
  }

  componentDidMount() {
    const slider = document.querySelector('.c-about-history .js_slider');
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
    });
    slider.addEventListener('on.lory.touchstart', () => {
      this.setState({ sliderOnMovement: true });
    });
    slider.addEventListener('on.lory.touchend', () => {
      setTimeout(() => { this.setState({ sliderOnMovement: false }); }, 500);
    });
  }

  checkButtonsVisibility () {
    const currentIndex = this.state.slider.returnIndex();
    this.setState({ sliderPrevIsVisible: currentIndex !== 0 });
    this.setState({ sliderNextIsVisible: currentIndex !== this.years.length - 1 });
  };

  onClickPrevSlide = () => {
    this.state.slider.prev();
  };

  onClickNextSlide = () => {
    this.state.slider.next();
  };

  render() {
    const slidePrevVisibilityClass = `c-about-history__arrow-button -left ${!this.state.sliderPrevIsVisible ? '-hidden' : ''}`;
    const slideNextVisibilityClass = `c-about-history__arrow-button -right ${!this.state.sliderNextIsVisible ? '-hidden' : ''}`;

    return (
      <Element name="history" className="c-about-history">
        <div className="row">
          <div className="small-12 columns">
            <div className="c-home-use-examples__content">
              <div className="c-about-history__title text -title-xs -color-3">HISTORY</div>
              <div className={`slider js_slider ${this.state.sliderOnMovement ? '-on-movement' : ''}`}>
                <div className="frame js_frame">
                  <ul className="slides js_slides">
                    {this.years.map((item, i) =>
                      <li key={i} className={`slide js_slide ${i === 0 ? 'active' : ''}`}>
                        <div className="c-about-history-item">
                          <div className="c-about-history-item__image">
                            <img src={item.img} />
                          </div>
                          <div className="c-about-history-item__texts">
                            <div className="c-about-history-item__title text -title -light -color-2"><span>{item.title}</span></div>
                            <div className="c-about-history-item__paragraph text -paragraph -color-2">{item.paragraph}</div>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                  <div className={slidePrevVisibilityClass} onClick={this.onClickPrevSlide}>
                    <ButtonArrow orientation="left" />
                  </div>
                  <div className={slideNextVisibilityClass} onClick={this.onClickNextSlide}>
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
