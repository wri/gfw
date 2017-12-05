import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ScrollEvent from 'react-onscroll';
import ProjectsGLobe from 'pages/sgf/section-projects/section-projects-globe';
import ProjectsModal from 'pages/sgf/section-projects/section-projects-modal';
import Card from 'components/card';
import ItemsList from 'components/items-list';
import Search from 'components/search';

import './section-projects-styles.scss';

class SectionProjects extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sticky: false
    };
    this.handleScrollCallback = this.handleScrollCallback.bind(this);
  }

  handleScrollCallback = () => {
    const { clientHeight } = this.cardListSection;
    const heightHeaderCover = 415;
    if (clientHeight > 100) {
      if (
        window.scrollY > heightHeaderCover &&
        window.scrollY < clientHeight + heightHeaderCover
      ) {
        this.setState({
          sticky: true
        });
      } else {
        this.setState({
          sticky: false
        });
      }
    }
  };

  handleCardClick = d => {
    this.props.setSectionProjectsModal({
      isOpen: true,
      data: d
    });
  };

  render() {
    const {
      data,
      categories,
      setCategorySelected,
      categorySelected,
      search,
      setSearch
    } = this.props;
    const { sticky } = this.state;
    const hasData = data && !!data.length;
    const hasCategories = categories && !!categories.length;

    return (
      <div className="">
        <ScrollEvent handleScrollCallback={this.handleScrollCallback} />
        <div className="l-section">
          <div className="row">
            <div className="column small-6">
              <h2 className="text -color-2 -title-xs -half-opacity">
                SMALL GRANTS FUND RECIPIENTS
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="column small-6">
              <ProjectsGLobe data={data} />
            </div>

            <div
              className={`column small-6 section-projects-list ${
                sticky ? '-sticky' : ''
              }`}
            >
              {hasCategories && (
                <div>
                  <Search
                    className="search"
                    placeholder="Search"
                    input={search}
                    onChange={setSearch}
                  />
                  <ItemsList
                    data={categories}
                    itemSelected={categorySelected}
                    onClick={setCategorySelected}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="l-section card-list-section"
          ref={c => {
            this.cardListSection = c;
          }}
        >
          {hasData && (
            <ul className="row card-list">
              <div className="row card-list-section">
                {data.map(d => (
                  <li key={d.id} className="column small-12 large-6">
                    <Card data={d} onClick={this.handleCardClick} />
                  </li>
                ))}
              </div>
            </ul>
          )}
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
  setSectionProjectsModal: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired
};

export default SectionProjects;
