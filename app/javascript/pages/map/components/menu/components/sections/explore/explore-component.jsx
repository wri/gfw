import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import SubnavMenu from 'components/subnav-menu';
import Card from 'components/ui/card';
import Loader from 'components/ui/loader';
import PTWProvider from 'providers/ptw-provider';

import './explore-styles.scss';

class Explore extends PureComponent {
  render() {
    const {
      section,
      data,
      setMenuSettings,
      handleViewOnMap,
      query,
      description,
      mapState,
      loading
    } = this.props;
    const links = [
      {
        label: 'Topics',
        active: section === 'topics',
        onClick: () => setMenuSettings({ exploreSection: 'topics' })
      },
      {
        label: 'Places to watch',
        active: section === 'placesToWatch',
        onClick: () => setMenuSettings({ exploreSection: 'placesToWatch' })
      }
    ];

    return (
      <div className="c-explore">
        <SubnavMenu
          links={links}
          className="explore-menu"
          theme="theme-subnav-small-light"
        />
        <div className="content">
          <div className="row">
            <div className="column small-12">
              <div className="description">
                {section === 'placesToWatch' ? (
                  <Fragment>
                    {description}
                    <PTWProvider date={new Date()} />
                  </Fragment>
                ) : (
                  description
                )}
              </div>
            </div>
            {!loading &&
              data &&
              data.map(item => (
                <div
                  key={item.slug || item.id}
                  className="column small-12 medium-6"
                >
                  <Card
                    className="map-card"
                    theme="theme-card-small"
                    data={{
                      ...item,
                      buttons: [
                        item.buttons[0],
                        {
                          ...item.buttons[1],
                          onClick: () => {
                            handleViewOnMap({ ...item.payload, query });
                          }
                        }
                      ]
                    }}
                    active={isEqual(item.payload.map, mapState)}
                  />
                </div>
              ))}
            {loading && <Loader />}
          </div>
        </div>
      </div>
    );
  }
}

Explore.propTypes = {
  section: PropTypes.string,
  data: PropTypes.array,
  setMenuSettings: PropTypes.func,
  description: PropTypes.string,
  mapState: PropTypes.object,
  loading: PropTypes.bool,
  handleViewOnMap: PropTypes.func,
  query: PropTypes.object
};

export default Explore;
