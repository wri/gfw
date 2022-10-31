import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import useRouter from 'utils/router';

import { Row, Column, Button, Desktop } from 'gfw-components';

import Dropdown from 'components/ui/dropdown';
import Icon from 'components/ui/icon';
import ModalVideo from 'components/modals/video';

import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';
import playIcon from 'assets/icons/play.svg?sprite';
import growth from 'layouts/about/projects/images/growth.png';

import CountryDataProvider from 'providers/country-data-provider';

import { getProjectsProps } from 'layouts/grants-and-fellowships/projects/selectors';

import './styles.scss';

const AboutProjectsSection = ({
  sgfProjects: allProjects,
  countries: allCountries,
}) => {
  const [country, setCountry] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const router = useRouter();

  const { countries } = useMemo(
    () =>
      getProjectsProps({
        projects: allProjects,
      }),
    [allProjects]
  );

  const countryOptions = useMemo(
    () => allCountries?.filter(({ value }) => countries?.includes(value)) || [],
    [allCountries, countries]
  );

  const handleCountrySelected = (option) => {
    setCountry(option?.value);
  };

  const handleCountryButtonClick = () => {
    router.push({
      pathname: '/grants-and-fellowships/projects/',
      query: { country },
    });
  };

  return (
    <>
      <div className="l-section-projects">
        <Row>
          <Column width={[1]}>
            <h3>WHAT IS GLOBAL FOREST WATCH?</h3>
            <div
              className="video-btn"
              onClick={() => !videoModalOpen && setVideoModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              <Button round size="medium" className="video-icon">
                <Icon icon={playIcon} />
              </Button>
              <p className="video-msg">Watch this 2 minute video</p>
              <ModalVideo
                open={videoModalOpen}
                src="//www.youtube.com/embed/lTG-0brb98I?rel=0&autoplay=1&showinfo=0&controls=0&modestbranding=1"
                onRequestClose={() => setVideoModalOpen(false)}
              />
            </div>
          </Column>
        </Row>
        <Row>
          <Column width={[1, 17 / 36]}>
            <h3>WHO USES GLOBAL FOREST WATCH?</h3>
            <p>
              Thousands of people around the world use GFW every day to monitor
              and manage forests, stop illegal deforestation and fires, call out
              unsustainable activities, defend their land and resources,
              sustainably source commodities, and conduct research at the
              forefront of conservation.
            </p>
            <a
              href="https://www.globalforestwatch.org/help/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="help-btn">LEARN HOW TO USE GFW</Button>
            </a>
          </Column>
          <Column width={[1, 2 / 36]} />
          <Column width={[1, 17 / 36]}>
            <h3>HOW DO PEOPLE USE GLOBAL FOREST WATCH?</h3>
            <p>
              Click
              {' '}
              <Link href="/grants-and-fellowships">
                <a target="_blank" rel="noopener noreferrer">
                  here
                </a>
              </Link>
              {' '}
              to learn about how others have used Global Forest Watch in their
              network.
            </p>

            <p>You can also choose a country from the list below:</p>
            <div className="country-selector">
              <Dropdown
                className="countries-dropdown"
                options={countryOptions}
                value={country}
                onChange={handleCountrySelected}
                theme="theme-dropdown-button-big"
                placeholder="Select a country"
                noSelectedValue="Select a country"
                clearable
                searchable
              />
              <Button
                round
                size="big"
                className="country-button"
                onClick={handleCountryButtonClick}
              >
                <Icon icon={arrowDownIcon} />
              </Button>
            </div>
          </Column>
        </Row>
        <Desktop>
          <div
            className="visitors"
            style={{ backgroundImage: `url(${growth})` }}
          >
            <h4>
              Since its launch in 2014, over 4 million people have visited
              Global Forest Watch from every single country in the world.
            </h4>
          </div>
        </Desktop>
      </div>
      <CountryDataProvider />
    </>
  );
};

AboutProjectsSection.propTypes = {
  sgfProjects: PropTypes.array,
  countries: PropTypes.array,
};

export default AboutProjectsSection;
