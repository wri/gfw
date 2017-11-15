import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/button-regular';

import './section-about-styles.scss';
import Card from './project-card';
import sgfLogo from './img/GFW_SGF_logo.png';
import sfgBg1 from './img/SGF_slider01.png';

class SectionAbout extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <section className="l-section">
          <div className="row">
            <div className="column small-9">
              <p className="text -paragraph -color-2 -light -spaced">
                The Small Grants Fund seeks to promote uptake of Global Forest
                Watch by civil society organizations to use in their research,
                advocacy, and fieldwork. The fund provides grants between
                US$10,000 and US$40,000 and technical support to civil society
                organizations for project implementation. Additionally, grant
                recipients have the opportunity to form part of a unique network
                of environmental organizations, working around the globe towards
                objectives like increasing women’s participation in land use
                decision-making in Indonesia, protecting jaguars in Nicaragua,
                mapping mangroves in Madagascar, monitoring the impact of
                mega-dam projects in Brazil, and more.
              </p>
            </div>
            <div className="column small-3 -right">
              <img
                src={sgfLogo}
                alt="Logo Global Forest Watch Small Grant Funds"
              />
            </div>
          </div>
        </section>
        <section
          className="l-section -large-p"
          style={{ backgroundImage: `url(${sfgBg1})` }}
        >
          <ul className="row">
            {this.props.cards.map(card => (
              <li className="column small-4" key={card.title}>
                <Card data={card} />
              </li>
            ))}
          </ul>
          <p className="copyright-section">
            <strong>Photo credit:</strong> African Conservation Foundation
          </p>
        </section>
        <section className="l-section">
          <div className="row">
            <div className="column small-9">
              <div className="section-header">
                <h2 className="text -color-2 -title-big -light">Support us</h2>
              </div>
              <p className="text -paragraph -color-2 -light -spaced">
                We&apos;re fundraising to support the continuation of the SGF!
                The fund provides grants between US$10,000 and US$40,000 and
                technical support to civil society organizations for project
                implementation. Additionally, grant recipients have the
                opportunity to form part of a unique network of environmental
                organizations, working around the globe towards objectives…
              </p>
              <div className="section-footer">
                <Button color="green" text="LEARN MORE" className="btn-space" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

SectionAbout.propTypes = {
  cards: PropTypes.array.isRequired
};

export default SectionAbout;
