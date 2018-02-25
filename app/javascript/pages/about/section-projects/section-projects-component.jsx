import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProjectsGLobe from 'pages/sgf/section-projects/section-projects-globe';
import ProjectsModal from 'pages/sgf/section-projects/section-projects-modal';
import ItemsList from 'components/items-list';

import './section-projects-styles.scss';

class SectionProjects extends PureComponent {
  render() {
    const {
      data,
      categories,
      setCategorySelected,
      categorySelected
    } = this.props;
    const hasCategories = categories && !!categories.length;

    return (
      <div>
        <div className="l-section-projects">
          <div className="row">
            <div className="column small-12 large-7 project-globe">
              <ProjectsGLobe data={data} />
            </div>
            <div className="column small-12 large-5">
              <h3>WHO USES GLOBAL FOREST WATCH?</h3>
              <p>
                Thousands of people around the world use GFW every day to
                monitor and manage forests, stop illegal deforestation and
                fires, call out unsustainable activities, defend their land and
                resources, sustainably source commodities, and conduct research
                at the forefront of conservation.
              </p>
              {hasCategories && (
                <ItemsList
                  className="project-list"
                  data={categories}
                  itemSelected={categorySelected}
                  onClick={setCategorySelected}
                />
              )}
            </div>
          </div>
        </div>
        <ProjectsModal />
      </div>
    );
  }
}

SectionProjects.propTypes = {
  data: PropTypes.array,
  categories: PropTypes.array.isRequired,
  categorySelected: PropTypes.string.isRequired,
  setCategorySelected: PropTypes.func.isRequired
};

export default SectionProjects;
