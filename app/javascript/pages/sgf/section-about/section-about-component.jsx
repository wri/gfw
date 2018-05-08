import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';

import sgfLogo from './img/GFW_SGF_logo.png';

import './section-about-styles.scss';

class SectionAbout extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { results, benefits } = this.props;
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
        <section className="program">
          <div className="row">
            <div className="column small-12">
              <h2 className="section-title">Program Benefits</h2>
              <ul className="list">
                {benefits && benefits.map(item => <li key={item}>- {item}</li>)}
              </ul>
              <p>
                Small Grants Fund projects have used GFW to strengthen community
                land rights, by providing evidence of the benefits of
                community-monitored forests; alert authorities to illegal
                deforestation, resulting in fines for the perpetrators; and
                create campaigns, to raise awareness of deforestation drivers
                and hold those responsible to account.
              </p>
            </div>
          </div>
        </section>
        <section className="results">
          <div className="row">
            <div className="column small-12">
              <h2 className="section-title">Results</h2>
              <div className="row icon-list">
                {results &&
                  results.map(item => (
                    <div key={item.label} className="column small-12 medium-4">
                      <Icon icon={item.icon} />
                      <p dangerouslySetInnerHTML={{ __html: item.label }} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
        <section className="support">
          <div className="row">
            <div className="column small-12 medium-9">
              <h2 className="section-title">Support the Small Grants Fund</h2>
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
  results: PropTypes.array.isRequired,
  benefits: PropTypes.array.isRequired
};

export default SectionAbout;
