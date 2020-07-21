import React, { PureComponent } from 'react';

import Icon from 'components/ui/icon';

import sgfLogo from './img/GFW_SGF_logo.png?webp';
import techLogo from './img/GFW_TECH_logo.png?webp';

import { sgfBenefits, fellowshipBenefits, results } from './config';

import './styles.scss';

class SectionAbout extends PureComponent {
  render() {
    return (
      <div className="l-section-about">
        <section className="intro">
          <div className="row intro">
            <div className="column small-12 medium-9">
              <h2 className="section-title" id="small-grants-fund">
                Small Grants Fund
              </h2>
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
            <div className="column small-12 medium-9">
              <h3 className="section-subtitle">Program Benefits</h3>
              <ul className="list">
                {sgfBenefits &&
                  sgfBenefits.map((item) => (
                    <li key={item}>
                      -
                      {item}
                    </li>
))}
              </ul>
            </div>
          </div>
        </section>
        <section className="program">
          <div className="row">
            <div className="column small-12 medium-9">
              <p className="text -paragraph -color-2 -light -spaced">
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
              <h2 className="section-subtitle">Results</h2>
              <div className="row icon-list">
                {results &&
                  results.map((item) => (
                    <div key={item.label} className="column small-12 medium-4">
                      <Icon icon={item.icon} />
                      <p dangerouslySetInnerHTML={{ __html: item.label }} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
        <section className="intro">
          <div className="row intro">
            <div className="column small-12 medium-9">
              <h2 className="section-title" id="tech-fellowship">
                Tech Fellowship
              </h2>
              <p className="text -paragraph -color-2 -light -spaced">
                The Global Forest Watch Technology Fellowship aims to recruit
                and train the best and brightest forest managers, protectors and
                advocates in facing growing threats to forests through use of
                pioneering technology solutions and big data, and support others
                in their networks to do so as well. The objective of the
                fellowship program is to scale impact by developing a community
                of GFW power users and champions to support the use of the
                platform in priority countries, and develop a shared vision on
                how GFW tools and other forest monitoring technology can be used
                to protect forests in priority regions around the world. Fellows
                may be indigenous leaders, investigative journalists, public
                interest lawyers, foresters, environmental law enforcers,
                conservationists, or open data experts who have the passion to
                provide training and ongoing support to governments and local
                activists to use forest data and monitoring technology
                effectively within their work and to enhance their ability to
                participate in monitoring of illegal deforestation.
              </p>
            </div>
            <div className="column small-12 medium-3 logo">
              <img
                src={techLogo}
                alt="Logo Global Forest Watch Tech Fellowship"
              />
            </div>
          </div>
        </section>
        <section className="program">
          <div className="row">
            <div className="column small-12 medium-9">
              <h3 className="section-subtitle">Program Benefits</h3>
              <ul className="list">
                {fellowshipBenefits &&
                  fellowshipBenefits.map((item) => (
                    <li key={item}>
                      -
                      {item}
                    </li>
))}
              </ul>
            </div>
          </div>
        </section>
        <section className="support">
          <div className="row">
            <div className="column small-12 medium-9">
              <h2 className="section-title" id="support">
                Support the Small Grants Fund and Fellowship
              </h2>
              <p className="text -paragraph -color-2 -light -spaced">
                If you would like to contribute to supporting communities, civil
                society, organizations, and individuals in using GFW to protect
                and sustainably manage the world’s forests, please contact us at
                {' '}
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

export default SectionAbout;
