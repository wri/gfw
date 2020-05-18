import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Globe from 'components/globe';
import ProjectsModal from 'pages/about/section-projects/section-projects-modal';
import ItemsList from 'components/items-list';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import { SCREEN_L } from 'utils/constants';
import MediaQuery from 'react-responsive';

import playIcon from 'assets/icons/play.svg';
import growth from 'pages/about/section-projects/images/growth.png';
import './section-projects-styles.scss';

class SectionProjects extends PureComponent {
  render() {
    const {
      projects,
      categories,
      setCategorySelected,
      categorySelected,
      handleGlobeClick,
      setModalVideoData
    } = this.props;
    const hasCategories = categories && !!categories.length;

    return (
      <div className="l-section-projects">
        <div className="row">
          <MediaQuery minWidth={SCREEN_L}>
            {isDesktop =>
              isDesktop && (
                <div className="column small-12 large-6 project-globe">
                  <Globe
                    autorotate={false}
                    data={projects}
                    onClick={handleGlobeClick}
                  />
                  <ProjectsModal />
                </div>
              )
            }
          </MediaQuery>
          <div className="column small-12 large-6 project-side">
            <h3>WHAT IS GLOBAL FOREST WATCH?</h3>
            <div
              className="video-btn"
              onClick={() =>
                setModalVideoData({
                  open: true,
                  data: {
                    src:
                      '//www.youtube.com/embed/lTG-0brb98I?rel=0&autoplay=1&showinfo=0&controls=0&modestbranding=1'
                  }
                })
              }
              role="button"
              tabIndex={0}
            >
              <Button theme="square" className="video-icon">
                <Icon icon={playIcon} />
              </Button>
              <p className="video-msg">Watch this 2 minute video</p>
            </div>
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
            <Button
              className="how-to-btn"
              extLink="https://www.globalforestwatch.org/howto/"
            >
              LEARN HOW TO USE GFW
            </Button>
          </div>
        </div>
        <div className="visitors" style={{ backgroundImage: `url(${growth})` }}>
          <h4>
            Since its launch in 2014, over 4 million people have visited Global
            Forest Watch from every single country in the world.
          </h4>
        </div>
      </div>
    );
  }
}

SectionProjects.propTypes = {
  projects: PropTypes.array,
  categories: PropTypes.array,
  categorySelected: PropTypes.string,
  setCategorySelected: PropTypes.func.isRequired,
  handleGlobeClick: PropTypes.func.isRequired,
  setModalVideoData: PropTypes.func
};

export default SectionProjects;
