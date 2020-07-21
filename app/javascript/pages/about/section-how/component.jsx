import React, { PureComponent } from 'react';

import transparency from 'pages/about/section-how/images/how-to-1.png?webp';
import engagement from 'pages/about/section-how/images/how-to-2.png?webp';
import community from 'pages/about/section-how/images/how-to-3.png?webp';

import './styles.scss';

const data = [
  {
    title: 'Transparency',
    text:
      "It's hard to manage what you can't measure. Global Forest Watch makes the best available data about forests available online for free, creating unprecedented transparency about what is happening in forests worldwide. Better information supports smarter decisions about how to manage and protect forests for current and future generations, and greater transparency helps the public hold governments and companies accountable for how their decisions impact forests. GFW data is accessed daily by governments, companies, civil society organizations, journalists, and everyday people who care about their local forests.",
    img: transparency,
    credits: 'Bangkukuk, Nicaragua',
  },
  {
    title: 'Engagement',
    text:
      "GFW engages our users to help them apply our data and technology to improve forest management around the world. For example, we have supported governments to use our open source platform to create customized online maps that support national policy planning and implementation. GFW's private sector team works with the world’s biggest food producers to help them use GFW tools to identify and eliminate deforestation in their supply chains. The GFW Small Grants Fund provides civil society organizations with technical and financial support to help them apply GFW data in their research, advocacy, and fieldwork.",
    img: engagement,
    credits: 'Forest Watcher, WRI',
  },
  {
    title: 'Community',
    text:
      'GFW has built an extensive partnership of over 100 organizations, researchers, and companies that together drive forward a sustainable vision for forests. The GFW partnership unites those working on the forefront of forest monitoring technology with leaders in conservation and sustainability, and a community of over 1 million users.',
    img: community,
    credits: 'Arend de Hass, ACF',
  },
];

class SectionHow extends PureComponent {
  state = {
    activeCategory: 'Transparency',
  };

  handleCatChange = (cat) => {
    this.setState({ activeCategory: cat });
  };

  render() {
    const { activeCategory } = this.state;
    const currentData = data.find((d) => d.title === activeCategory);

    return (
      <section className="l-section-how">
        <div className="panel left-panel">
          <h3>HOW DOES GFW CREATE CHANGE?</h3>
          {data.map((d) => (
            <div
              key={d.title}
              className={`list-item ${
                activeCategory === d.title ? 'selected' : ''
              }`}
            >
              <button onClick={() => this.handleCatChange(d.title)}>
                <span />
                {d.title}
              </button>
              {activeCategory === d.title && <p>{d.text}</p>}
            </div>
          ))}
        </div>
        <div
          className="panel right-panel"
          style={{
            backgroundImage: `url(${currentData.img})`,
          }}
        />
      </section>
    );
  }
}

export default SectionHow;
