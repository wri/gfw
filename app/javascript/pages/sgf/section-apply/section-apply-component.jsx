import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Card from 'pages/sgf/card';
import sfgBg1 from './img/sgf-apply-bg.png';
import './section-apply-styles.scss';

class SectionAbout extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { cards } = this.props;
    return (
      <div>
        <section className="l-section">
          <div className="row">
            <div className="column small-9">
              <p className="text -paragraph -color-2 -light -spaced">
                The 2016 Small Grants Fund application period is now closed. To
                be notified of future open application cycles, please send an
                email to{' '}
                <a
                  className="text -paragraph -color-4 -light"
                  href="mailto:gfwfund@wri.org"
                >
                  gfwfund@wri.org
                </a>.
              </p>
              <p className="text -paragraph -color-2 -light -spaced">
                For more information about application requirements from past
                cycles, please consult the Guidelines for Applicants or the SGF
                Frequently Asked Questions
              </p>
            </div>
          </div>
        </section>
        <section
          className="l-section -large-p"
          style={{ backgroundImage: `url(${sfgBg1})` }}
        >
          <div className="section-header -center">
            <h2 className="text -color-1 -light -title-big">
              Meet the Grantees
            </h2>
            <p className="text -paragraph -color-1 -light">
              There have been over 30 projects in almost as many countries!
            </p>
          </div>
          {cards &&
            cards.length && (
              <ul className="row">
                {this.props.cards.map(card => (
                  <li className="column small-4" key={card.title}>
                    <Card data={card} className="-centered" />
                  </li>
                ))}
              </ul>
            )}
          <p className="copyright-section">
            <strong>Photo credit:</strong> African Conservation Foundation
          </p>
        </section>
        <section className="l-section">
          <div className="row">
            <div className="column small-9">
              <div className="section-header">
                <h2 className="text -color-2 -title-big -light">
                  Resources and support
                </h2>
                <h3 className="text -color-2 -title-xs -light">
                  SMALL GRANTS FUND WEBINARS
                </h3>
              </div>
              <ul>
                <li>
                  <a
                    className="text -color-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.youtube.com/watch?v=RtcrS7dmhcI"
                  >
                    How to apply
                  </a>
                </li>
                <li>
                  <a
                    className="text -color-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.youtube.com/watch?v=uHt1FqaSPwQ"
                  >
                    Stories from the Field: 2015 projects
                  </a>
                </li>
              </ul>
              <div className="section-separator" />
              <a href="/howto" className="text -color-2 -title-xs -light">
                HOW TO PORTAL
              </a>
              <p className="text -paragraph-3 -color-2 -light">
                Visit the How To page for video tutorials and step by step
                instructions for how to visualize global and country data,
                analyze forest change, subscribe to alerts, submit stories and
                more.
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
