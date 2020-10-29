import { Row, Column } from 'gfw-components';

import Icon from 'components/ui/icon';

import sgfLogo from './assets/gfw-sgf-logo.png';
import techLogo from './assets/gfw-tech-fellowship-logo.png';

import { sgfBenefits, fellowshipBenefits, results } from './config';

import './styles.scss';

const GrantsAboutSection = () => (
  <div className="l-grants-about-section">
    <section className="intro">
      <Row className="intro">
        <Column width={[1, 3 / 4]}>
          <h2 className="section-title" id="small-grants-fund">
            Small Grants Fund
          </h2>
          <p className="text -paragraph -color-2 -light -spaced">
            Civil Society Organizations operating in and around forested areas
            are some of the most effective champions of forest conservation and
            management. However, they frequently lack the resources or knowledge
            of how to incorporate the latest forest-monitoring technology into
            their research, advocacy, and field work. The Small Grants Fund
            provides financial and technical support to organizations around the
            world to use Global Forest Watch’s tools and data to turn forest
            monitoring information into action. Working in close partnership
            with local organizations also helps GFW to understand how we can
            best adapt our tools to meet the unique needs of this user group.
          </p>
        </Column>
        <Column width={[1, 1 / 4]} className="logo">
          <img src={sgfLogo} alt="Logo Global Forest Watch Small Grant Funds" />
        </Column>
      </Row>
    </section>
    <section className="program">
      <Row>
        <Column width={[1, 3 / 4]}>
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
        </Column>
      </Row>
    </section>
    <section className="program">
      <Row>
        <Column width={[1, 3 / 4]}>
          <p className="text -paragraph -color-2 -light -spaced">
            Small Grants Fund projects have used GFW to strengthen community
            land rights, by providing evidence of the benefits of
            community-monitored forests; alert authorities to illegal
            deforestation, resulting in fines for the perpetrators; and create
            campaigns, to raise awareness of deforestation drivers and hold
            those responsible to account.
          </p>
        </Column>
      </Row>
    </section>
    <section className="results">
      <Row>
        <Column>
          <h2 className="section-subtitle">Results</h2>
          <Row nested className="icon-list">
            {results &&
              results.map((item) => (
                <Column width={[1, 1 / 3]} key={item.label}>
                  <Icon icon={item.icon} />
                  <p dangerouslySetInnerHTML={{ __html: item.label }} />
                </Column>
              ))}
          </Row>
        </Column>
      </Row>
    </section>
    <section className="intro">
      <Row className="intro">
        <Column width={[1, 3 / 4]}>
          <h2 className="section-title" id="tech-fellowship">
            Tech Fellowship
          </h2>
          <p className="text -paragraph -color-2 -light -spaced">
            The Global Forest Watch Technology Fellowship aims to recruit and
            train the best and brightest forest managers, protectors and
            advocates in facing growing threats to forests through use of
            pioneering technology solutions and big data, and support others in
            their networks to do so as well. The objective of the fellowship
            program is to scale impact by developing a community of GFW power
            users and champions to support the use of the platform in priority
            countries, and develop a shared vision on how GFW tools and other
            forest monitoring technology can be used to protect forests in
            priority regions around the world. Fellows may be indigenous
            leaders, investigative journalists, public interest lawyers,
            foresters, environmental law enforcers, conservationists, or open
            data experts who have the passion to provide training and ongoing
            support to governments and local activists to use forest data and
            monitoring technology effectively within their work and to enhance
            their ability to participate in monitoring of illegal deforestation.
          </p>
        </Column>
        <Column width={[1, 1 / 4]} className="logo">
          <img src={techLogo} alt="Logo Global Forest Watch Tech Fellowship" />
        </Column>
      </Row>
    </section>
    <section className="program">
      <Row>
        <Column width={[1, 3 / 4]}>
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
        </Column>
      </Row>
    </section>
    <section className="support">
      <Row>
        <Column width={[1, 3 / 4]}>
          <h2 className="section-title" id="support">
            Support the Small Grants Fund and Fellowship
          </h2>
          <p className="text -paragraph -color-2 -light -spaced">
            If you would like to contribute to supporting communities, civil
            society, organizations, and individuals in using GFW to protect and
            sustainably manage the world’s forests, please contact us at
            {' '}
            <a
              className="text -paragraph -color-4 -light"
              href="mailto:gfwfund@wri.org"
            >
              gfwfund@wri.org.
            </a>
          </p>
        </Column>
      </Row>
    </section>
  </div>
);

export default GrantsAboutSection;
