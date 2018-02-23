import React, { Component } from 'react';
import { lory } from 'lory.js';

class AboutAwards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slider: null
    };

    this.awards = [
      {
        img : '/assets/backgrounds/awards.png',
        url : 'http://events.esri.com/conference/sagList/'
      },
      {
        img : "/assets/backgrounds/awards2.png",
        url : "http://www.unglobalpulse.org/big-data-climate-challenge-winners-announced"
      },
      {
        img : "/assets/backgrounds/awards3.png",
        url : "http://www.socialtech.org.uk/projects/global-forest-watch/"
      },
      {
        img : "/assets/backgrounds/awards1.png",
        url : "http://www.computerworld.com/article/2977562/data-analytics/world-resources-institute.html"
      }
    ]
  }

  componentDidMount() {
    const slider = document.querySelector('.c-about-awards .js_slider');
    this.setState({
      slider: lory(slider, {
        enableMouseEvents: true,
        slideSpeed: 500
      })
    });
  }

  render() {
    return (
      <div className="c-about-awards">
        <div className="row">
          <div className="small-12 columns">
            <div className="c-about-awards__title text -title-xs -color-3">AWARDS</div>
            <div className="slider js_slider">
              <div className="frame js_frame">
                <ul className="slides js_slides">
                  {this.awards.map((item, i) =>
                    <li key={i} className={`slide js_slide ${i === 0 ? 'active' : ''}`}>
                      <div className="c-about-awards-item">
                        <a target="_blank" href={item.url}>
                          <img src={item.img} />
                        </a>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutAwards;
