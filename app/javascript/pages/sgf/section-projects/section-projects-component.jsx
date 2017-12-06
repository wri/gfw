import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProjectsGLobe from 'pages/sgf/section-projects/section-projects-globe';
import ProjectsModal from 'pages/sgf/section-projects/section-projects-modal';
import Card from 'components/card';
import ItemsList from 'components/items-list';
import Search from 'components/search';
import Sticky from 'components/sticky';
import NoContent from 'components/no-content';

import './section-projects-styles.scss';

class SectionProjects extends PureComponent {
  render() {
    const {
      data,
      categories,
      setCategorySelected,
      categorySelected,
      search,
      setSearch
    } = this.props;
    const hasData = data && !!data.length;
    const hasCategories = categories && !!categories.length;

    return (
      <div>
        <div className="l-section-projects">
          <div className="row project-header">
            <div className="column small-12">
              <h2 className="text -color-2 -title-xs -half-opacity">
                SMALL GRANTS FUND RECIPIENTS
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="column small-12 large-7 project-globe">
              <ProjectsGLobe data={data} />
            </div>
            <div className="column small-12 large-5">
              <Sticky>
                <Search
                  className="project-search"
                  placeholder="Search"
                  input={search}
                  onChange={setSearch}
                />
                {hasCategories && (
                  <ItemsList
                    className="project-list"
                    data={categories}
                    itemSelected={categorySelected}
                    onClick={setCategorySelected}
                  />
                )}
              </Sticky>
            </div>
          </div>
          <div className="row">
            <div className="column small-12 large-7">
              <div className="row">
                {hasData ? (
                  data.map(d => (
                    <div key={d.id} className="column small-12 medium-6">
                      <Card
                        className="project-card"
                        data={d}
                        onClick={this.handleCardClick}
                      />
                    </div>
                  ))
                ) : (
                  <NoContent message="No projects for that search" />
                )}
              </div>
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
  setCategorySelected: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired
};

export default SectionProjects;
