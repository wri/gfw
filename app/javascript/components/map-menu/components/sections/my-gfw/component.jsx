import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MyGFWLogin from 'components/mygfw-login';
import Button from 'components/ui/button/button-component';
import Pill from 'components/ui/pill';

import './styles.scss';

class MapMenuSearch extends PureComponent {
  renderLoginWindow() {
    const { isDesktop } = this.props;
    return (
      <div className="content">
        <div className="row">
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
      </div>
    );
  }

  renderNoAreas() {
    const { isDesktop } = this.props;
    return (
      <div className="row">
        {isDesktop && (
          <h2 className="title-create-aois">
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
    const { isDesktop, areas } = this.props;
    return (
      <div className="row">
        <div className="column">
          {isDesktop && (
            <h2 className="title-create-aois">Areas of interest</h2>
          )}
          <div className="aoi-tags">
            <Pill
              key={'all'}
              active
              label={'all'}
              // TODO: onRemove={() => remove(tag)}
            >
              all
            </Pill>
          </div>
          <div className="aoi-items">
            {areas.map(area => (
              <div className="aoi-item">
                <img src={area.image} alt={area.name} />
                <p className="aoi-title">{area.name}</p>
                {area.tags.map(tag => <span>{tag}</span>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  renderMyGFW() {
    const { areas } = this.props;

    return (
      <div className="content">
        {areas && areas.length > 0 ? this.renderAreas() : this.renderNoAreas()}
      </div>
    );
  }

  render() {
    const { loggedIn } = this.props;

    return (
      <div className="c-map-menu-my-gfw">
        {loggedIn ? this.renderMyGFW() : this.renderLoginWindow()}
      </div>
    );
  }
}

MapMenuSearch.propTypes = {
  isDesktop: PropTypes.bool,
  loggedIn: PropTypes.bool,
  areas: PropTypes.array
};

export default MapMenuSearch;
