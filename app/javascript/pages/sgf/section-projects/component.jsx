import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Globe from 'components/globe';
import ProjectsModal from 'pages/sgf/section-projects/section-projects-modal';
import Card from 'components/ui/card';
import ItemsList from 'components/items-list';
import Search from 'components/ui/search';
import NoContent from 'components/ui/no-content';
import Loader from 'components/ui/loader';
import { Element as ScrollEl } from 'react-scroll';

import { Media } from 'utils/responsive';

import './styles.scss';

class SectionProjects extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    globeData: PropTypes.array,
    categories: PropTypes.array,
    categorySelected: PropTypes.string,
    setCategorySelected: PropTypes.func,
    search: PropTypes.string,
    setSearch: PropTypes.func.isRequired,
    handleGlobeClick: PropTypes.func,
    handleOpenModal: PropTypes.func,
    loading: PropTypes.bool,
  };

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
      handleOpenModal,
      loading,
    } = this.props;
    const hasData = data && data.length > 0;
    const hasCategories = categories && !!categories.length;

    return (
      <Fragment>
        <div className="l-section-projects-sgf">
          <div className="row">
            <div className="column small-12 large-7 project-globe">
              <Media greaterThanOrEqual="lg">
                <ul className="tags">
                  <li>
                    <span id="grants" /> 
                    {' '}
                    <p>Grantees</p>
                  </li>
                  <li>
                    <span id="fellows" /> 
                    {' '}
                    <p>Fellows</p>
                  </li>
                </ul>
                <Globe
                  autorotate={false}
                  data={globeData}
                  onClick={handleGlobeClick}
                />
              </Media>
            </div>
            <div className="column small-12 large-5 side">
              <h3>MEET THE GRANTEES AND FELLOWS</h3>
              <p className="text -paragraph -color-2 -light -spaced">
                With financial and technical support from GFW, organizations and
                individuals around the world are using Global Forest Watch to
                monitor large-scale land-use projects, enforce community land
                rights, defend critical habitat, and influence forest policy.
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
          <div className="row">
            <div className="column small-12 medium-6 large-4 medium-offset-6 large-offset-8">
              <Search
                className="project-search"
                placeholder="Search"
                input={search}
                onChange={setSearch}
              />
            </div>
          </div>
          <ScrollEl name="project-cards" className="row project-cards">
            {hasData &&
              !loading &&
              data.map((d) => {
                const isFellow =
                  d.categories && d.categories.indexOf('Fellow') !== -1;
                return (
                  <div
                    key={d.id}
                    className="column small-12 medium-6 large-4 card-container"
                  >
                    <Card
                      className="project-card"
                      data={{
                        ...d,
                        tag: isFellow ? 'fellow' : 'grantee',
                        tagColor: isFellow ? '#f88000' : '#97bd3d',
                        buttons: [
                          {
                            className: 'read-more',
                            text: 'READ MORE',
                            onClick: () => handleOpenModal(d.id),
                          },
                        ],
                      }}
                    />
                  </div>
                );
              })}
            {!loading && !hasData && (
              <NoContent
                className="no-projects"
                message="No projects for that search"
              />
            )}
            {loading && <Loader loading={loading} />}
          </ScrollEl>
        </div>
        <ProjectsModal />
      </Fragment>
    );
  }
}

export default SectionProjects;
