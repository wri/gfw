import compellingDataIcon from './assets/icons/compellingdata.svg?sprite';
import powerfulAnalysisIcon from './assets/icons/powerfulanalysis.svg?sprite';
import provenPlatformIcon from './assets/icons/provenplatform.svg?sprite';
import broadReachIcon from './assets/icons/broadreach.svg?sprite';

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
};
