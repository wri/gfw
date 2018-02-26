import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProjectsGLobe from 'components/globe-projects';
import ProjectsModal from 'pages/about/section-projects/section-projects-modal';
import ItemsList from 'components/items-list';
import Button from 'components/button';

import './section-projects-styles.scss';

class SectionProjects extends PureComponent {
  render() {
    const {
      projects,
      categories,
      setCategorySelected,
      categorySelected,
      setSectionProjectsModal
    } = this.props;
    const hasCategories = categories && !!categories.length;

    return (
      <div className="l-section-projects">
        <div className="row">
          <div className="column small-12 large-6 project-globe">
            <ProjectsGLobe data={projects} setModal={setSectionProjectsModal} />
            <ProjectsModal />
          </div>
          <div className="column small-12 large-6 project-side">
            <h3>WHO USES GLOBAL FOREST WATCH?</h3>
            <p>
              Thousands of people around the world use GFW every day to monitor
              and manage forests, stop illegal deforestation and fires, call out
              unsustainable activities, defend their land and resources,
              sustainably source commodities, and conduct research at the
              forefront of conservation.
            </p>
            {hasCategories && (
              <ItemsList
                className="project-list"
                data={categories}
                itemSelected={categorySelected}
                onClick={setCategorySelected}
              />
            )}
            <Button className="how-to-btn" extLink="/howto">
              LEARN HOW TO USE GFW
            </Button>
          </div>
        </div>
        <div className="visitors">
          <h4>
            Since launching in 2014, over 1.5 million people have visited Global
            Forest Watch from every single country in the world.
          </h4>
        </div>
      </div>
    );
  }
}

SectionProjects.propTypes = {
  projects: PropTypes.array,
  categories: PropTypes.array.isRequired,
  categorySelected: PropTypes.string.isRequired,
  setCategorySelected: PropTypes.func.isRequired,
  setSectionProjectsModal: PropTypes.func.isRequired
};

export default SectionProjects;
