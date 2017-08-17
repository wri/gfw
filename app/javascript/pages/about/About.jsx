import React from 'react';
import PropTypes from 'prop-types';
import AboutHeader from './components/AboutHeader/AboutHeader';
import AboutCover from './components/AboutCover/AboutCover';
import AboutAnchors from './components/AboutAnchors/AboutAnchors';
import AboutWorld from './components/AboutWorld/AboutWorld';
import AboutHow from './components/AboutHow/AboutHow';
import AboutOutcomes from './components/AboutOutcomes/AboutOutcomes';
import AboutAwards from './components/AboutAwards/AboutAwards';
import AboutHistory from './components/AboutHistory/AboutHistory';
import AboutLogos from './components/AboutLogos/AboutLogos';

const About = (props) => {
  return (
    <div>
      <AboutHeader />
      <AboutCover title="About" description="Global Forest Watch (GFW) is an online platform that provides data and tools for monitoring forests. By harnessing cutting-edge technology, GFW allows anyone to access near real-time information about where and how forests are changing around the world."/>
      <AboutAnchors />
      <AboutWorld />
      <AboutHow />
      <AboutOutcomes />
      <AboutAwards />
      <AboutHistory />
      <AboutLogos />
    </div>
  );
};

export default About;
