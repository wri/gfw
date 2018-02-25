import React, { Component } from 'react';
import { Element } from 'react-scroll';
import Button from 'components/button';
import ModalSubscribe from '../AboutModals/AboutModalSubscribe';

class AboutLogos extends Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.state = {
      showModal: false
    };
  }

  openModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  render() {
    const { showModal } = this.state;

    return (
      <Element name="partnership">
        <div className="c-about-footer-logos">
          <div id="about-page" />
          <div className="row">
            <div className="small-12 columns">
              <div className="c-about-footer-logos__title text -title-xs -color-3">
                Founding Partners
              </div>
              <div className="list-logos row">
                {foundingPartners.map(item => (
                  <a
                    key={item.title}
                    className="columns small-6 medium-4 large-3"
                    href={item.link}
                    target="_blank"
                  >
                    <img alt={item.title} src={item.img} />
                  </a>
                ))}
              </div>
              <div className="c-about-footer-logos__title text -title-xs -color-3">
                Partners
              </div>
              <div className="list-logos row">
                {partnersCollaborators.map(item => (
                  <a
                    key={item.title}
                    className="columns small-6 medium-4 large-3"
                    href={item.link}
                    target="_blank"
                  >
                    <img alt={item.title} src={item.img} />
                  </a>
                ))}
              </div>
              <div className="c-about-footer-logos__title text -title-xs -color-3">
                Funders
              </div>
              <div className="list-logos row">
                {funders.map(item => (
                  <a
                    key={item.title}
                    className="columns small-6 medium-4 large-3"
                    href={item.link}
                    target="_blank"
                  >
                    <img alt={item.title} src={item.img} />
                  </a>
                ))}
              </div>
            </div>
            <div className="c-about-footer-logos__subscribe small-12 columns">
              <span className="text -title-xs -color-3">
                We welcome others to join the growing GFW partnership.
              </span>
              <Button className="contact-us-button" onClick={this.openModal}>
                EMAIL US
              </Button>
            </div>
          </div>
        </div>
        <ModalSubscribe open={showModal} clickFunction={this.openModal} />
      </Element>
    );
  }
}

export default AboutLogos;
