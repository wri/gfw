import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProjectsGLobe from 'pages/sgf/section-projects/section-projects-globe';
import ProjectsModal from 'pages/sgf/section-projects/section-projects-modal';
import Card from 'components/card';

// import styles from './section-projects-styles.scss';

class SectionProjects extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, categories, setCategorySelected } = this.props;
    const hasData = data && !!data.length;
    const hasCategories = categories && !!categories.length;
    return (
      <div className="">
        <div className="l-section">
          <div className="row">
            <div className="column small-6">
              <h2 className="text -color-2 -title-xs -light">
                SUPPORT THE SMALL GRANTS FUND
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="column small-6">
              <ProjectsGLobe data={data} />
            </div>
            <div className="column small-6">
              <div className=".section-projects-list">
                {hasCategories && (
                  <ul>
                    {categories.map(c => (
                      <li key={c}>
                        <button onClick={() => setCategorySelected(c)}>
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="l-section">
          {hasData && (
            <ul className="row card-list">
              {data.map(d => (
                <li key={d.id} className="column small-6">
                  <Card data={d} />
                </li>
              ))}
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
  setCategorySelected: PropTypes.func.isRequired
};

export default SectionProjects;
