// import forestWatcherIcon from 'assets/icons/forest-watcher.svg';
// import proIcon from 'assets/icons/gfw-pro.svg';

// import conservationOrgs from './assets/conservation-orgs.jpg?webp';
// import policyMakers from './assets/policy-makers.jpg?webp';
// import journalists from './assets/journalists.jpg?webp';
// import company from './assets/company.jpg?webp';

import compellingDataIcon from './assets/icons/compellingdata.svg?sprite';
import powerfulAnalysisIcon from './assets/icons/powerfulanalysis.svg?sprite';
import provenPlatformIcon from './assets/icons/provenplatform.svg?sprite';
import broadReachIcon from './assets/icons/broadreach.svg?sprite';

import cameroonForestAtlasImg from './assets/cameroon-forest-atlas.png?webp';
import gabonForestAtlasImg from './assets/gabon-forest-atlas.png?webp';
import equatorialGuineaForestAtlasImg from './assets/equatorial-guinea-forest-atlas.png?webp';

export default {
  summary: [
    {
      title: 'Compelling data',
      summary:
        'Combine GFW datasets, dozens of layers available through ArcGIS Online and your own uploaded data.',
      icon: compellingDataIcon,
    },
    {
      title: 'Powerful analysis',
      summary:
        'Leverage GFW’s powerful geospatial analysis tools including tree cover loss, land cover composition and GLAD alert analysis.',
      icon: powerfulAnalysisIcon,
    },
    {
      title: 'Proven platform',
      summary:
        'MapBuilder integrates with both organizational and free public ArcGIS Online accounts as an application template.',
      icon: provenPlatformIcon,
    },
    {
      title: 'Broad reach',
      summary:
        'Applications can be deployed as stand-alone websites, embedded into your website or shared using integrated social media tools.',
      icon: broadReachIcon,
    },
  ],
  guide: [
    {
      key: 'step1',
      text:
        'Step-by-step tutorials and videos teach you how to set up an ArcGIS Online account, create your MapBuilder and share your map online. Tutorials are available for both public and organization ArcGIS accounts.',
    },
    {
      key: 'step2',
      text:
        'Add data layers to your ArcGIS Online webmap and combine your data with GFW data layers using the GFW MapBuilder application template.',
    },
    {
      key: 'step3',
      text:
        'Easily embed your MapBuilder into your own website, share the link with colleagues and peers or use integrated social media tools for sharing.',
    },
  ],
  maps: [
    {
      title: 'Cameroon Forest Atlas',
      summary: 'View an interactive map with land-use data for Cameroon.',
      image: cameroonForestAtlasImg,
      extLink: 'http://cmr.forest-atlas.org',
    },
    {
      title: 'Gabon Forest Atlas',
      summary: 'View an interactive map with land-use data for Gabon.',
      image: gabonForestAtlasImg,
      extLink: 'http://gab.forest-atlas.org',
    },
    {
      title: 'Equatorial Guinea Forest Atlas',
      summary:
        'View an interactive map with land-use data for Equatorial Guinea.',
      image: equatorialGuineaForestAtlasImg,
      extLink: 'http://gnq.forest-atlas.org',
    },
  ],
  // tutorials: [
  //   {
  //     title: 'MapBuilder Interactive Map Overview',
  //     summary: 'View an interactive map with land-use data for Cameroon.',
  //     image: cameroonForestAtlasImg,
  //     buttons: [
  //       {
  //         text: 'view map',
  //         extLink: 'http://cmr.forest-atlas.org',
  //       }
  //     ]
  //   },
  // ]
};
