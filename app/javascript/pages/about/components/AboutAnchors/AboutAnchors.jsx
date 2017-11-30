import React from 'react';
import {Link, DirectLink, scroll, scrollSpy } from 'react-scroll';

const AboutAnchors = (props) => {
  return (
    <div className="c-about-anchors">
      <div className="row">
        <div className="small-12 columns">
          <ul className="c-about-anchors__buttons">
            <Link to="actionGlobe" spy={true} smooth={true} duration={500} >
              <li className="text -paragraph-5 -color-8">GFW in Action</li>
            </Link>
            <Link to="howTo" spy={true} smooth={true} duration={700} >
              <li className="text -paragraph-5 -color-8">Impacts</li>
            </Link>
            <Link to="history" spy={true} smooth={true} duration={900} >
              <li className="text -paragraph-5 -color-8">History</li>
            </Link>
            <Link to="contactUs" spy={true} smooth={true} duration={1100} >
              <li className="text -paragraph-5 -color-8">Contact Us</li>
            </Link>
            <Link to="partnership" spy={true} smooth={true} duration={1300} >
              <li className="text -paragraph-5 -color-8">Partnership</li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutAnchors;
