import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Row, Column, Button, Desktop } from 'gfw-components';

import Globe from 'components/globe';
import ItemsList from 'components/items-list';
import Icon from 'components/ui/icon';
import ModalVideo from 'components/modals/video';

import playIcon from 'assets/icons/play.svg?sprite';
import growth from 'components/pages/about/section-projects/images/growth.png';

import ProjectsModal from './projects-modal';

import './styles.scss';

const SectionProjects = ({ categories, projectsByCategory }) => {
  const [category, setCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const selectedProjects = projectsByCategory[category];

  return (
    <div className="l-section-projects">
      <Row>
        <Column width={[1, 1 / 2]} className="project-globe">
          <Desktop>
            <Globe
              autorotate={false}
              data={selectedProjects}
              onClick={setSelectedProject}
            />
            <ProjectsModal
              data={selectedProject}
              onRequestClose={() => setSelectedProject(null)}
            />
          </Desktop>
        </Column>
        <Column width={[1, 1 / 2]} className="project-side">
          <h3>WHAT IS GLOBAL FOREST WATCH?</h3>
          <div
            className="video-btn"
            onClick={() => !videoModalOpen && setVideoModalOpen(true)}
            role="button"
            tabIndex={0}
          >
            <Button round className="video-icon">
              <Icon icon={playIcon} />
            </Button>
            <p className="video-msg">Watch this 2 minute video</p>
            <ModalVideo
              open={videoModalOpen}
              src="//www.youtube.com/embed/lTG-0brb98I?rel=0&autoplay=1&showinfo=0&controls=0&modestbranding=1"
              onRequestClose={() => setVideoModalOpen(false)}
            />
          </div>
          <h3>WHO USES GLOBAL FOREST WATCH?</h3>
          <p>
            Thousands of people around the world use GFW every day to monitor
            and manage forests, stop illegal deforestation and fires, call out
            unsustainable activities, defend their land and resources,
            sustainably source commodities, and conduct research at the
            forefront of conservation.
          </p>
          <ItemsList
            className="project-list"
            data={categories}
            itemSelected={category}
            onClick={setCategory}
          />
          <a
            href="https://www.globalforestwatch.org/help/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="help-btn">LEARN HOW TO USE GFW</Button>
          </a>
        </Column>
      </Row>
      <div className="visitors" style={{ backgroundImage: `url(${growth})` }}>
        <h4>
          Since its launch in 2014, over 4 million people have visited Global
          Forest Watch from every single country in the world.
        </h4>
      </div>
    </div>
  );
};

SectionProjects.propTypes = {
  projectsByCategory: PropTypes.object,
  categories: PropTypes.array,
};

export default SectionProjects;
