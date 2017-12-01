import React, { Component } from 'react';
import PropTypes from 'prop-types'

class AboutModalWorld extends Component {
  render() {
    if (this.props.isVisible) {
      return (
        <div className="c-about-modal-world">
          <div className="c-about-modal-world__back" onClick={this.props.hideModal}>{}</div>
          <div className="c-about-modal-world__text">
            <svg className="icon-close" onClick={this.props.hideModal}><use xlinkHref="#icon-close"></use></svg>
            <div>
              <h2 className="text -title -color-2">{this.props.userData.title}</h2>
              <p className="text -title-xs -color-2">{this.props.userData.description}</p>
            </div>
            <div className="contain-buttons">
              {this.props.userData.link ? <a href={this.props.userData.link} target="_blank" className="c-regular-button -green ">LEARN MORE</a> : null}
              {this.props.userData.sgf ? <div className="contain-tooltip"><div className="tooltip-modal"><div className="triangle"><span>small grants fund</span></div></div><a href="/small-grants-fund" className="text -color-2 button-round">$</a></div> : null}
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}

AboutModalWorld.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  userData: PropTypes.object
};

export default AboutModalWorld;
