import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Globe from 'components/globe';
import ProjectsModal from 'pages/sgf/section-projects/section-projects-modal';
import Card from 'components/card';
import ItemsList from 'components/items-list';
import Search from 'components/search';
import NoContent from 'components/no-content';
import Loader from 'components/loader';
import { Element as ScrollEl } from 'react-scroll';

import './section-projects-styles.scss';

class SectionProjects extends PureComponent {
  render() {
    const {
      data,
      globeData,
      categories,
      setCategorySelected,
      categorySelected,
      search,
      setSearch,
      handleGlobeClick,
      setSectionProjectsModal,
      loading
    } = this.props;
    const hasData = data && !!data.length;
    const hasCategories = categories && !!categories.length;

    return (
      <div>
        <div className="l-section-projects">
          <div className="row project-header">
            <div className="column small-12">
              <h2>SMALL GRANTS FUND RECIPIENTS</h2>
            </div>
          </div>
          <div className="row">
            <div className="column small-12 large-7 project-globe">
              <Globe
                autorotate={false}
                data={globeData}
                onClick={handleGlobeClick}
              />
            </div>
            <div className="column small-12 large-5">
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
            </div>
          </div>
          <ScrollEl name="project-cards" className="row project-cards">
            {hasData &&
              !loading &&
              data.map(d => (
                <div
                  key={d.id}
                  className="column small-12 medium-4 card-container"
                >
                  <Card
                    className="project-card"
                    data={d}
                    onClick={() =>
                      setSectionProjectsModal({
                        isOpen: true,
                        data: d
                      })
                    }
                  />
                </div>
              ))}
            {!loading &&
              !hasData && <NoContent message="No projects for that search" />}
            {loading && <Loader loading={loading} />}
          </ScrollEl>
        </div>
        <ProjectsModal />
      </div>
    );
  }
}

SectionProjects.propTypes = {
  data: PropTypes.array,
  globeData: PropTypes.array,
  categories: PropTypes.array,
  categorySelected: PropTypes.string.isRequired,
  setCategorySelected: PropTypes.func.isRequired,
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  handleGlobeClick: PropTypes.func,
  setSectionProjectsModal: PropTypes.func,
  loading: PropTypes.bool
};

export default SectionProjects;
