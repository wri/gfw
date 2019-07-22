import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MyGFWLogin from 'components/mygfw-login';
import Button from 'components/ui/button/button-component';
import Icon from 'components/ui/icon/icon-component';
import Pill from 'components/ui/pill';
import editIcon from 'assets/icons/edit.svg';
import screenImg1x from 'assets/images/aois/single A.png';
import screenImg2x from 'assets/images/aois/single A @2x.png';

import './styles.scss';

class MapMenuMyGFW extends PureComponent {
  constructor() {
    super();
    this.state = {
      activeTags: {}
    };
  }

  setTags() {
    const { areas } = this.props;
    const tags = {};
    if (areas) {
      areas.forEach(area =>
        area.tags.forEach(tag => {
          if (tags[tag] === undefined) {
            tags[tag] = false;
          }
        })
      );
    }
    this.setState({ activeTags: tags });
  }

  componentDidMount() {
    this.setTags();
  }

  renderLoginWindow() {
    const { isDesktop } = this.props;
    return (
      <div className="aoi-header">
        {isDesktop && <h3 className="title-login">Please log in</h3>}
        <p>
          Log in is required so you can view, manage, and delete your Areas of
          Interest.
        </p>
        <p>
          Creating an Area of Interest lets you customize and perform an
          in-depth analysis of the area, as well as receiving email
          notifications when new deforestation alerts are available.
        </p>
        <MyGFWLogin className="mygfw-login" simple />
      </div>
    );
  }

  renderNoAreas() {
    const { isDesktop } = this.props;
    return (
      <div className="aoi-header">
        {isDesktop && (
          <h2 className="title-no-aois">
            You haven&apos;t created any Areas of Interest yet
          </h2>
        )}
        <p>
          Creating an Area of Interest lets you customize and perform an
          in-depth analysis of the area, as well as receiving email
          notifications when new deforestation alerts are available.
        </p>
        <Button theme="theme-button-small">Learn how</Button>
      </div>
    );
  }

  renderAreas() {
    const { isDesktop, areas, activeArea, goToAOI, onEditClick } = this.props;
    const activeTags = Object.keys(this.state.activeTags).filter(
      tag => this.state.activeTags[tag]
    );
    const activeAreas =
      activeTags.length > 0
        ? areas.filter(
          area =>
            area.tags.filter(tag => activeTags.indexOf(tag) > -1).length > 0 // is any of the area.tags in activeTags?
        )
        : areas;
    return (
      <div>
        <div className="aoi-header">
          {isDesktop && (
            <h3 className="title-create-aois">Areas of interest</h3>
          )}
          <div className="aoi-tags">
            {Object.keys(this.state.activeTags).map(tag => (
              <Pill
                className="clickable-tag"
                key={tag}
                active={this.state.activeTags[tag]}
                label={tag}
                onClick={() =>
                  this.setState({
                    activeTags: {
                      ...this.state.activeTags,
                      [tag]: !this.state.activeTags[tag]
                    }
                  })
                }
              />
            ))}
          </div>
        </div>
        <div className="aoi-items">
          {activeAreas.map(area => {
            const active = activeArea && activeArea.id === area.id;
            return (
              <div
                className={cx('aoi-item', active && '--active')}
                key={area.name}
                onClick={() => goToAOI(area)}
                role="button"
                tabIndex={0}
              >
                <img src={area.image} alt={area.name} />
                {/* TODO: vertically align body with img */}
                <div className="aoi-item-body">
                  <p className="aoi-title">{area.name}</p>
                  <div className="aoi-tags">
                    {area.tags.map(tag => (
                      <Pill
                        key={tag}
                        active={this.state.activeTags[tag]}
                        label={tag}
                      />
                    ))}
                  </div>
                </div>
                {active && (
                  <Button
                    className="edit-button"
                    theme="theme-button-small square theme-button-clear"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEditClick({ open: true });
                    }}
                  >
                    <Icon icon={editIcon} className="info-icon" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderMyGFW() {
    const { areas } = this.props;

    return (
      <div className="my-gfw-aois">
        {areas && areas.length > 0 ? this.renderAreas() : this.renderNoAreas()}
      </div>
    );
  }

  render() {
    const { loggedIn, areas } = this.props;

    return (
      <div className="c-map-menu-my-gfw">
        {loggedIn ? this.renderMyGFW() : this.renderLoginWindow()}
        {(!loggedIn || !(areas && areas.length > 0)) && (
          <img
            className="my-gfw-login-image"
            src={screenImg1x}
            srcSet={`${screenImg1x} 1x, ${screenImg2x} 2x`}
            alt="aoi screenshot"
          />
        )}
      </div>
    );
  }
}

MapMenuMyGFW.propTypes = {
  isDesktop: PropTypes.bool,
  loggedIn: PropTypes.bool,
  areas: PropTypes.array,
  activeArea: PropTypes.object,
  goToAOI: PropTypes.func,
  onEditClick: PropTypes.func
};

export default MapMenuMyGFW;
