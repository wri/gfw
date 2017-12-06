import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ButtonRegular from 'components/button-regular/button-regular';
import Globe from '../../../about/components/AboutUsers/globe/index';
import AboutModalWorld from '../../../about/components/AboutModals/AboutModalWorld';

class AboutUsers extends Component {
  constructor(props) {
    super(props);

    this.users = [
      { title: 'All' },
      { title: 'Advocacy' },
      { title: 'Forest monitoring and enforcement' },
      { title: 'Journalism' },
      { title: 'Land use planning and zoning' },
      { title: 'Project monitoring and evaluation' },
      { title: 'Research' },
      { title: 'Responsible investing' },
      { title: 'Supply chain monitoring' }
    ];

    this.state = {
      globeWidth: 0
    };
  }

  componentDidMount() {
    this.globeContainer = document.querySelector(
      '.c-about-users__globe-container'
    );
    this.setState({ globeWidth: this.globeContainer.clientWidth });
  }

  selectUser = title => {
    if (this.props.selectedUserGroup !== title) {
      this.props.setUserGroup(title);
    }
  };

  render() {
    const globe =
      this.state.globeWidth > 0 ? (
        <Globe
          width={this.state.globeWidth}
          height={this.state.globeWidth}
          autorotate={false}
          dataGroup={this.props.selectedUserGroup}
          setUserData={this.props.setUserData}
        />
      ) : null;

    const growthDates = [];
    for (let i = 2014; i <= new Date().getFullYear(); i++) {
      growthDates.push(i);
    }

    return (
      <div name="actionGlobe" className="c-about-users">
        <div className="row">
          <div className="large-6 columns">
            <div className="c-about-users__globe-container">
              {globe}
              <AboutModalWorld
                isVisible={this.props.isModalVisible}
                userData={this.props.selectedUserData}
                hideModal={this.props.hideModal}
              />
            </div>
          </div>
          <div className="small-12 large-6 columns">
            <div className="c-about-users__content">
              <div className="c-about-users__title text -title-xs -color-3">
                WHO USES GLOBAL FOREST WATCH?
              </div>
              <div className="c-about-users__summary text -paragraph -color-2">
                Thousands of people around the world use GFW every day to
                monitor and manage forests, stop illegal deforestation and
                fires, call out unsustainable activities, defend their land and
                resources, sustainably source commodities, and conduct research
                at the forefront of conservation.
              </div>
              <ul className="c-about-users__user-list text -paragraph -color-2">
                {this.users.map((item, i) => (
                  <li
                    key={i}
                    className={`${
                      this.props.selectedUserGroup === item.title
                        ? '-selected'
                        : ''
                    }`}
                    onClick={() => this.selectUser(item.title)}
                  >
                    <svg className="icon">
                      <use xlinkHref="#icon-little-arrow" />
                    </svg>
                    {item.title}
                  </li>
                ))}
              </ul>
              <div className="c-about-users__button">
                <ButtonRegular text="LEARN HOW TO USE GFW" color="green" />
              </div>
            </div>
          </div>
        </div>
        <div className="c-about-users__growth text -title -light -color-2">
          <p>Since launching in 2014,</p>
          <p>over 1.5 million people have visited Global Forest Watch</p>
          <p>from every single country in the world.</p>
          <ul className="c-about-users__growth-years text -paragraph-6">
            {growthDates.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

AboutUsers.propTypes = {
  setUserData: PropTypes.func.isRequired,
  setUserGroup: PropTypes.func.isRequired,
  selectedUserData: PropTypes.object,
  selectedUserGroup: PropTypes.string.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired
};

export default AboutUsers;
