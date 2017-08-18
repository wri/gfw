import React, { Component } from 'react';
import Proptypes from 'prop-types';

class AboutHow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };
  }

  changeContent(value) {
    this.setState({
      active: value,
    });
  }

  render() {
    const {active} = this.state;
    const howToInformation = [
      {
        title: 'Radical Transparency',
        text: 'Global Forest Watch aims to safeguard forests by creating radical transparency around deforestation and forest degradation globally. By making the best available data on forests available to anyone, GFW empowers governments and companies to make sustainable and equitable decisions about forest management and land use, while also equipping members of civil society such as NGOs and journalists with the information they need to play an active role in protecting forests.',
        img : "/assets/backgrounds/about-how-to/1.png",
        credits: 'Bangkukuk, Nicaragua'
      },
      {
        title: 'Feedback Loop',
        text: 'Global Forest Watch provides data and tools to civil society, the private sector, and governments to make better decisions about land use and forest management. The platform incorporates feedback through collaboration with users that improves the relevance and value of GFW to their work.',
        img : "/assets/backgrounds/about-how-to/2.png",
        credits: 'Forest Watcher, WRI'
      },
      {
        title: 'Connecting people who care',
        text: 'Global Forest Watch provides data and tools to civil society, the private sector, and governments to make better decisions about land use and forest management. The platform incorporates feedback through collaboration with users that improves the relevance and value of GFW to their work.',
        img : "/assets/backgrounds/about-how-to/3.png",
        credits: 'Arend de Hass, ACF'
      },
    ]

    return (
      <div className="c-about-how">
        <div className="row">
          <div className="small-12 large-6 columns">
            <div className="c-about-how__content">
              <div className="c-about-how__title text -title-xs -color-3">HOW DOES GFW CREATE CHANGE?</div>
                {howToInformation.map((item, i) =>
                  <div key={i}>
                    <div className="c-about-how__subtitle text -paragraph -color-2" onClick={()=>this.changeContent(i)}><span className={`${i === active ? '-active' : ''}`}></span>{item.title}</div>
                    <div className={`c-about-how__summary text -paragraph -color-2 ${i === active ? '-active' : ''}`}>{item.text}</div>
                  </div>
                )}
            </div>
          </div>
          {howToInformation.map((item, i) =>
            <div key={i} className={`c-about-how__cover ${i === active ? '-active' : ''}`} style={{backgroundImage: `url(${item.img})`}}>
              <div className="c-about-how__cover-credits">{item.credits}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AboutHow;
