import React from 'react';
import SubMenuNav from 'components/subnav-menu/subnav-menu';

const links = [
  { anchor: 'howTo', label: 'GFW in Action' },
  { anchor: 'impacts', label: 'Impacts' },
  { anchor: 'history', label: 'History' },
  { anchor: 'contactUs', label: 'Contact Us' },
  { anchor: 'partnership', label: 'Partnership' }
];

const AboutAnchors = () => <SubMenuNav links={links} />;

export default AboutAnchors;
