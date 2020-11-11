import { useState } from 'react';
import cx from 'classnames';

import { Media } from 'gfw-components';
import Icon from 'components/ui/icon';

import profileIcon from 'assets/icons/profile.svg?sprite';

import USE_SECTIONS from './config';

import './styles.scss';

const HomeUses = () => {
  const [section, setSection] = useState('Conservation Orgs');
  const { profile, example, credit, img } = USE_SECTIONS.find(
    (u) => u.profile === section
  );

  return (
    <div className="c-home-uses">
      <div className="use-column">
        <div className="use-slide">
          <h2>What can you do with Global Forest Watch?</h2>
          <p className="use-example">
            <i>
              <span>“</span>
              {example}
              <span>”</span>
            </i>
          </p>
          <div className="use-user-menu">
            {USE_SECTIONS.map((s) => (
              <button
                key={s.profile}
                className={cx('use-user', { '-active': s.profile === section })}
                onClick={() => setSection(s.profile)}
              >
                <Icon className="icon-user" icon={profileIcon} />
                {s.profile}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Media className="use-column" greaterThanOrEqual="small">
        <img src={img} alt={profile} className="use-img" />
        <a
          className="use-credit"
          href={credit.extLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {credit.name}
        </a>
      </Media>

      {/* <Carousel
        className="uses-carousel"
        settings={{
          slidesToShow: 1,
          dots: true,
          arrows: false,
          speed: 0,
          customPaging: (i) => (
            <div className="use-user">
              <Icon className="icon-user" icon={profileIcon} />
              {USE_SECTIONS[i].profile}
            </div>
          ),
        }}
      >
        {USE_SECTIONS.map((c) => (
          <Row className="uses" key={c.example}>
            <Column width={[1, 1 / 2]}>
              <p className="use-example">
                <i>
                  <span>“</span>
                  {c.example}
                  <span>”</span>
                </i>
              </p>
            </Column>
            <Column width={[1, 1 / 2]}>
              <div
                className="use-image"
                style={{ backgroundImage: `url(${c.img})` }}
              >
                <a
                  className="use-credit"
                  href={c.credit.extLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.credit.name}
                </a>
              </div>
            </Column>
          </Row>
        ))}
      </Carousel> */}
    </div>
  );
};

export default HomeUses;
