import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Card from 'pages/sgf/section-about/section-about-card';
import sgfLogo from './img/GFW_SGF_logo.png';
import sfgBg1 from './img/sgf-about-bg.png';
import './section-about-styles.scss';

class SectionAbout extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { cards } = this.props;
    return (
      <div className="l-section-about">
        <section className="intro">
          <div className="row intro">
            <div className="column small-12 medium-9">
              <p className="text -paragraph -color-2 -light -spaced">
                Civil Society Organizations operating in and around forested
                areas are some of the most effective champions of forest
                conservation and management. However, they frequently lack the
                resources or knowledge of how to incorporate the latest
                forest-monitoring technology into their research, advocacy, and
                field work. The Small Grants Fund provides financial and
                technical support to organizations around the world to use
                Global Forest Watch’s tools and data to turn forest monitoring
                information into action. Working in close partnership with local
                organizations also helps GFW to understand how we can best adapt
                our tools to meet the unique needs of this user group.
              </p>
            </div>
            <div className="column small-12 medium-3 logo">
              <img
                src={sgfLogo}
                alt="Logo Global Forest Watch Small Grant Funds"
              />
            </div>
          </div>
        </section>
        <section
          className="about-cards"
          style={{ backgroundImage: `url(${sfgBg1})` }}
        >
          <div className="row cards">
            <div className="column small-12">
              {cards &&
                cards.length && (
                  <ul className="row">
                    {this.props.cards.map(card => (
                      <li
                        className="column small-12 medium-6 large-4"
                        key={card.title}
                      >
                        <Card
                          data={card}
                          className="about-card -big-padding -min-h"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              <p className="copyright-section">
                <strong>Photo credit:</strong> African Conservation Foundation
              </p>
            </div>
          </div>
        </section>
        <section className="support">
          <div className="row">
            <div className="column small-12 medium-9">
              <div className="section-header">
                <h2 className="text -color-2 -title-big -light">
                  Support the Small Grants Fund
                </h2>
              </div>
              <p className="text -paragraph -color-2 -light -spaced">
                If you would like to contribute to supporting communities and
                civil society organizations in using GFW to protect and
                sustainably manage the world’s forests, please contact us at{' '}
                <a
                  className="text -paragraph -color-4 -light"
                  href="mailto:gfwfund@wri.org"
                >
                  gfwfund@wri.org.
                </a>
              </p>
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
