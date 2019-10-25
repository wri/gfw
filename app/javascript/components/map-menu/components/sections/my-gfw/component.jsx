import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import intersection from 'lodash/intersection';
import { logout } from 'utils/auth';
import Link from 'redux-first-router-link';
import slice from 'lodash/slice';

import AoICard from 'components/aoi-card';
import MyGFWLogin from 'components/mygfw-login';
import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown';
import Icon from 'components/ui/icon/icon-component';
import Pill from 'components/ui/pill';
import Loader from 'components/ui/loader';
import Paginate from 'components/paginate';

import editIcon from 'assets/icons/edit.svg';
import logoutIcon from 'assets/icons/logout.svg';
import screenImg1x from 'assets/images/aois/aoi-dashboard.png';
import screenImg2x from 'assets/images/aois/aoi-dashboard@2x.png';

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
    tags: PropTypes.array,
    loading: PropTypes.bool,
    userData: PropTypes.object,
    setMapPromptsSettings: PropTypes.func
  };

  state = {
    activeTags: [],
    areas: [],
    selectedTags: [],
    unselectedTags: [],
    pageSize: 6,
    pageNum: 0
  };

  static getDerivedStateFromProps(prevProps, prevState) {
    const { areas, tags } = prevProps;
    const { activeTags, pageSize, pageNum } = prevState;

    const selectedTags = tags && tags.filter(t => activeTags.includes(t.value));
    const unselectedTags =
      tags && tags.filter(t => !activeTags.includes(t.value));
    const filteredAreas =
      selectedTags && selectedTags.length && areas && areas.length
        ? areas.filter(a => !!intersection(a.tags, activeTags).length)
        : areas;

    const areasTrimmed = slice(
      filteredAreas,
      pageSize * pageNum,
      pageSize * (pageNum + 1)
    );

    return {
      selectedTags,
      unselectedTags,
      areas: areasTrimmed
    };
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
        <MyGFWLogin className="mygfw-login" />
      </div>
    );
  }

  renderNoAreas() {
    const { isDesktop, setMapPromptsSettings } = this.props;
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
        <Button
          theme="theme-button-small"
          onClick={() =>
            setMapPromptsSettings({
              open: true,
              stepsKey: 'areaOfInterestTour',
              stepIndex: 0,
              force: true
            })
          }
        >
          Learn how
        </Button>
      </div>
    );
  }

  renderAreas() {
    const {
      isDesktop,
      activeArea,
      viewArea,
      onEditClick,
      areas: allAreas
    } = this.props;
    const {
      activeTags,
      areas,
      selectedTags,
      unselectedTags,
      pageSize,
      pageNum
    } = this.state;

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
                className="aoi-tags-dropdown"
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
          <Fragment>
            {areas &&
              areas.map((area, i) => {
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
            {allAreas.length > pageSize && (
              <Paginate
                className="areas-pagination"
                settings={{
                  page: pageNum,
                  pageSize
                }}
                count={allAreas.length}
                onClickChange={increment =>
                  this.setState({ pageNum: pageNum + increment })
                }
              />
            )}
          </Fragment>
        </div>
      </div>
    );
  }

  renderMyGFW() {
    const { areas, userData } = this.props;
    const { email, fullName } = userData || {};

    return (
      <div className="my-gfw">
        <div className="my-gfw-aois">
          {areas && areas.length > 0
            ? this.renderAreas()
            : this.renderNoAreas()}
        </div>
        <div className="my-gfw-footer">
          <Link to="/my-gfw" className="edit-button">
            {fullName && <span className="name">{fullName}</span>}
            {email && (
              <span className="email">
                <i>{email}</i>
              </span>
            )}
            {!fullName && !email && <span>view profile</span>}
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
    const { loggedIn, areas, isDesktop, loading } = this.props;

    return (
      <div className="c-map-menu-my-gfw">
        {loading && <Loader />}
        {!loading && loggedIn && this.renderMyGFW()}
        {!loading && !loggedIn && this.renderLoginWindow()}
        {!loading &&
          (!loggedIn || !(areas && areas.length > 0)) &&
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
