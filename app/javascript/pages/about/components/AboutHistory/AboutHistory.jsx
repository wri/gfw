import React, { Component } from 'react';
import { Element } from 'react-scroll';
import { lory } from 'lory.js';

import Button from 'components/button';

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
        img: '/assets/about/history/1997.jpg',
        imgPosition: 'center',
        title: '1997',
        paragraph:
          'The World Resources Institute (WRI) established Global Forest Watch in 1997 as part of the Forest Frontiers Initiative. It started as a network of NGOs producing up-to-date reports about the state of forests in four pilot countries: Cameroon, Canada, Gabon, and Indonesia.'
      },
      {
        img: '/assets/about/history/2002.jpg',
        imgPosition: 'center',
        title: '2002',
        paragraph:
          'By 2002, GFW had expanded its work to Chile, Russia, Venezuela, Indonesia, the Democratic Republic of Congo, and the United States, publishing reports about forest cover and conditions as well as activities affecting forests, like concessions and infrastructure. GFW planned to have its forest monitoring network up and running in 21 countries by 2005.'
      },
      {
        img: '/assets/about/history/2004.jpg',
        imgPosition: 'center',
        title: '2004',
        paragraph:
          "GFW began working with governments in Central Africa to create interactive, online maps of forests and land use called Forestry Atlases. The first map was created for Cameroon in collaboration with the Ministry of Environment and Forests of Cameroon (MINEF). The interactive maps, built on ESRI's ArcGIS Server, were soon expanded to all countries covered by GFW."
      },
      {
        img: '/assets/about/history/2005.jpg',
        imgPosition: 'left',
        title: '2005 - 2011',
        paragraph:
          'For the next six years, GFW continued producing global and regional maps and analyses of forests, while also expanding national mapping projects with governments. In 2006, GFW together with Greenpeace produced the first ever global map of remaining intact forest landscapes.'
      },
      {
        img: '/assets/about/history/2014.jpg',
        imgPosition: 'left',
        title: '2014',
        paragraph:
          'In 2014, WRI launched GFW 2.0, building on nearly two decades of work to create a fully interactive online platform with forest monitoring data for the whole world. The new iteration of GFW was made possible by advances in forest monitoring technology and an expanded group of partners.'
      },
      {
        img: '/assets/about/history/2015.jpg',
        imgPosition: 'right',
        title: '2015',
        paragraph:
          'To address the many challenges related to deforestation, Global Forest Watch began expanding with several new web applications: GFW Commodities to evaluate sustainability in commodity supply chains, GFW Fires to monitor forest and land fires and haze in SE Asia, and GFW Climate to assess the climate impacts of deforestation.'
      },
      {
        img: '/assets/about/history/2016.jpg',
        imgPosition: 'left',
        title: '2016',
        paragraph:
          'With further developments in satellite technology, GFW grew beyond annual data on forests and began providing monthly and weekly deforestation alerts. Email subscriptions brought these alerts directly into the hands of users, increasing their ability to respond to new activity in near real-time.'
      },
      {
        img: '/assets/about/history/2017.jpg',
        imgPosition: 'center',
        title: '2017',
        paragraph:
          'In 2017, GFW launched Forest Watcher, a mobile application that lets users take GFW’s data and tools offline and into the field. The app represents a new step in connecting the people working in forests directly with the information they need to protect them.'
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
  }

  onClickPrevSlide = () => {
    this.state.slider.prev();
  };

  onClickNextSlide = () => {
    this.state.slider.next();
  };

  checkButtonsVisibility() {
    const currentIndex = this.state.slider.returnIndex();
    this.setState({ sliderPrevIsVisible: currentIndex !== 0 });
    this.setState({
      sliderNextIsVisible: currentIndex !== this.years.length - 1
    });
  }

  render() {
    const slidePrevVisibilityClass = `c-about-history__arrow-button -left ${
      !this.state.sliderPrevIsVisible ? '-hidden' : ''
    }`;
    const slideNextVisibilityClass = `c-about-history__arrow-button -right ${
      !this.state.sliderNextIsVisible ? '-hidden' : ''
    }`;

    return (
      <Element name="history" className="c-about-history">
        <div className="row">
          <div className="small-12 columns">
            <div className="c-home-use-examples__content">
              <div className="c-about-history__title text -title-xs -color-3">
                HISTORY
              </div>
              <div className="slider js_slider">
                <div className="frame js_frame">
                  <ul className="slides js_slides">
                    {this.years.map((item, i) => (
                      <li
                        key={i}
                        className={`slide js_slide ${i === 0 ? 'active' : ''}`}
                      >
                        <div className="c-about-history-item">
                          <div
                            className={`c-about-history-item__image c-about-history-item__image--${
                              item.imgPosition
                            }`}
                            style={{ backgroundImage: `url(${item.img})` }}
                          />
                          <div className="c-about-history-item__texts">
                            <div className="c-about-history-item__title text -title -light -color-2">
                              <span>{item.title}</span>
                            </div>
                            <div className="c-about-history-item__paragraph text -paragraph -color-2">
                              {item.paragraph}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="square nav-left"
                    onClick={this.onClickPrevSlide}
                  >
                    <svg className="icon">
                      <use xlinkHref="#icon-arrow" />
                    </svg>
                  </Button>
                  <Button
                    className="square nav-right"
                    onClick={this.onClickNextSlide}
                  >
                    <svg className="icon">
                      <use xlinkHref="#icon-arrow" />
                    </svg>
                  </Button>
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
