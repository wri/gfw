import React, { Component } from 'react';
import {Element} from 'react-scroll';

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
        title: 'Transparency',
        text: 'It\'s hard to manage what you can\'t measure. Global Forest Watch makes the best available data about forests available online for free, creating unprecedented transparency about what is happening in forests worldwide. Better information supports smarter decisions about how to manage and protect forests for current and future generations, and greater transparency helps the public hold governments and companies accountable for how their decisions impact forests. GFW data is accessed daily by governments, companies, civil society organizations, journalists, and everyday people who care about their local forests.',
        img : "/assets/about/how-to-1.png",
        credits: 'Bangkukuk, Nicaragua'
      },
      {
        title: 'Engagement',
        text: 'GFW engages our users to help them apply our data and technology to improve forest management around the world. For example, we have supported governments to use our open source platform to create customized online maps that support national policy planning and implementation. GFW\'s private sector team works with the world’s biggest food producers to help them use GFW tools to identify and eliminate deforestation in their supply chains. The GFW Small Grants Fund provides civil society organizations with technical and financial support to help them apply GFW data in their research, advocacy, and fieldwork.',
        img : "/assets/about/how-to-2.png",
        credits: 'Forest Watcher, WRI'
      },
      {
        title: 'Community',
        text: 'GFW has built an extensive partnership of over 100 organizations, researchers, and companies that together drive forward a sustainable vision for forests. The GFW partnership unites those working on the forefront of forest monitoring technology with leaders in conservation and sustainability, and a community of over 1 million users.',
        img : "/assets/about/how-to-3.png",
        credits: 'Arend de Hass, ACF'
      }
    ];

    return (
      <Element name="howTo" className="c-about-how">
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
      </Element>
    );
  }
}

export default AboutHow;
