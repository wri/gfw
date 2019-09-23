import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import intersection from 'lodash/intersection';
import { logout } from 'utils/auth';
import Link from 'redux-first-router-link';

import AoICard from 'components/aoi-card';
import MyGFWLogin from 'components/mygfw-login';
import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown';
import Icon from 'components/ui/icon/icon-component';
import Pill from 'components/ui/pill';
import editIcon from 'assets/icons/edit.svg';
import logoutIcon from 'assets/icons/logout.svg';
import screenImg1x from 'assets/images/aois/singleA.png';
import screenImg2x from 'assets/images/aois/singleA@2x.png';

import './styles.scss';

class MapMenuMyGFW extends PureComponent {
  static propTypes = {
    isDesktop: PropTypes.bool,
    loggedIn: PropTypes.bool,
    areas: PropTypes.array,
    activeArea: PropTypes.object,
    viewArea: PropTypes.func,
    onEditClick: PropTypes.func,
    clearArea: PropTypes.func,
    location: PropTypes.object,
    tags: PropTypes.array
  };

  state = {
    activeTags: []
  };

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
        <MyGFWLogin className="mygfw-login" />
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
    const {
      isDesktop,
      areas,
      activeArea,
      viewArea,
      onEditClick,
      tags
    } = this.props;
    const { activeTags } = this.state;

    const selectedTags = tags.filter(t => activeTags.includes(t.value));
    const unselectedTags = tags.filter(t => !activeTags.includes(t.value));
    const filteredAreas =
      selectedTags && selectedTags.length && areas && areas.length
        ? areas.filter(a => !!intersection(a.tags, activeTags).length)
        : areas;

    return (
      <div>
        <div className="aoi-header">
          {isDesktop && (
            <h3 className="title-create-aois">Areas of interest</h3>
          )}
          <div className="aoi-tags">
            {selectedTags &&
              selectedTags.map(tag => (
                <Pill
                  className="aoi-tag"
                  key={tag.value}
                  active
                  label={tag.label}
                  onRemove={() =>
                    this.setState({
                      activeTags: activeTags.filter(t => t !== tag.value)
                    })
                  }
                />
              ))}
            {unselectedTags &&
              !!unselectedTags.length && (
              <Dropdown
                className="country-dropdown"
                theme="theme-dropdown-button theme-dropdown-button-small"
                placeholder={
                  activeTags && activeTags.length > 0
                    ? 'Add more tags'
                    : 'Filter by tags'
                }
                noItemsFound="No tags found"
                noSelectedValue={
                  activeTags && activeTags.length > 0
                    ? 'Add more tags'
                    : 'Filter by tags'
                }
                options={unselectedTags}
                onChange={tag =>
                  tag.value &&
                    this.setState({
                      activeTags: [...activeTags, tag.value]
                    })
                }
              />
            )}
          </div>
        </div>
        <div className="aoi-items">
          {filteredAreas &&
            filteredAreas.map((area, i) => {
              const active = activeArea && activeArea.id === area.id;
              return (
                <div
                  className={cx('aoi-item', {
                    '--active': active,
                    '--inactive': activeArea && !active
                  })}
                  onClick={() => viewArea({ areaId: area.id })}
                  role="button"
                  tabIndex={0}
                  key={area.id}
                >
                  <AoICard index={i} {...area} simple />
                  {active && (
                    <Button
                      className="edit-button"
                      theme="square theme-button-clear"
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
      <div className="my-gfw">
        <div className="my-gfw-aois">
          {areas && areas.length > 0
            ? this.renderAreas()
            : this.renderNoAreas()}
        </div>
        <div className="my-gfw-footer">
          <Link to="/my-gfw" className="edit-button">
            Update profile
            <Icon icon={editIcon} className="edit-icon" />
          </Link>
          <Button
            theme="theme-button-clear"
            className="logout-button"
            onClick={logout}
          >
            Log out
            <Icon icon={logoutIcon} className="logout-icon" />
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { loggedIn, areas, isDesktop } = this.props;

    return (
      <div className="c-map-menu-my-gfw">
        {loggedIn ? this.renderMyGFW() : this.renderLoginWindow()}
        {(!loggedIn || !(areas && areas.length > 0)) &&
          isDesktop && (
          <img
            className={cx('my-gfw-login-image', { '--login': !loggedIn })}
            src={screenImg1x}
            srcSet={`${screenImg1x} 1x, ${screenImg2x} 2x`}
            alt="aoi screenshot"
          />
        )}
      </div>
    );
  }
}

export default MapMenuMyGFW;
