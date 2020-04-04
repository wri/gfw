import { connect } from 'react-redux';

import Component from './component';

const images = require.context('assets/logos', true);

const foundingPartners = [
  {
    img: images(`./bobolinkfundation.png`),
    link: 'http://bobolinkfoundation.org',
    title: 'Bobo link Fundation',
  },
  {
    img: images('./bluerasterhover.png'),
    link: 'https://www.blueraster.com/',
    title: 'Blueraster',
  },
  {
    img: images('./cartodbhover.png'),
    link: 'https://carto.com/',
    title: 'Carto',
  },
  {
    img: images('./centerforglobaldevelopmenthover.png'),
    link: 'https://www.cgdev.org/',
    title: 'Center for Global Development',
  },
  {
    img: images('./danidahover.png'),
    link: 'http://um.dk/en/danida-en/',
    title: 'Danida',
  },
  {
    img: images('./esrihover.png'),
    link:
      'http://www.esri.com/landing-pages/fight-against-deforestation/global-forest-watch',
    title: 'ESRI',
  },
  {
    img: images('./gefhover.png'),
    link: 'http://www.thegef.org/',
    title: 'gef',
  },
  {
    img: images('./globalforestwatchcanadahover.png'),
    link: 'http://globalforestwatch.ca/',
    title: 'Global Forest Watch Canada',
  },
  {
    img: images('./googlehover.png'),
    link: 'https://earthengine.google.com/',
    title: 'Google',
  },
  {
    img: images('./imazonhover.png'),
    link: 'http://imazon.org.br/pagina-inicial-en?set_language=en&cl=en',
    title: 'Imazon',
  },
  {
    img: images('./ministryofforeignaffairshover.png'),
    link: 'https://www.government.nl/ministries/ministry-of-foreign-affairs',
    title: 'Ministry of Foreign Affairs',
  },
  {
    img: images('./norwegianministrihover.png'),
    link:
      'https://www.regjeringen.no/en/topics/climate-and-environment/climate/climate-and-forest-initiative/id2000712/',
    title: 'Norwegian Ministry',
  },
  {
    img: images('./osfachover.png'),
    link: 'https://osfac.net/index.php?lang=en',
    title: 'OSFA',
  },
  {
    img: images('./scannexhover.png'),
    link: 'http://www.scanex.ru/en/',
    title: 'Scannex',
  },
  {
    img: images('./sidahover.png'),
    link: 'http://www.sida.se/english/',
    title: 'SIDA',
  },
  {
    img: images('./thejanegoodallinstitutehover.png'),
    link: 'http://www.janegoodall.org/',
    title: 'The Jane Good all Institute',
  },
  {
    img: images('./thetiliafundhover.png'),
    link: 'http://www.tiliafund.org/',
    title: 'The Tila Fundation',
  },
  {
    img: images('./tiposhover.png'),
    link: 'http://www.transparentworld.ru/',
    title: 'TIPOS',
  },
  {
    img: images('./unephover.png'),
    link: 'http://www.unep.org/',
    title: 'UNEP',
  },
  {
    img: images('./universityofmarylandhover.png'),
    link: 'https://geog.umd.edu/',
    title: 'University of Maryland',
  },
  {
    img: images('./ukaidhover.png'),
    link:
      'https://www.gov.uk/government/organisations/department-for-international-development',
    title: 'UKAID',
  },
  {
    img: images('./usaidhover.png'),
    link: 'https://www.usaid.gov/',
    title: 'USAID',
  },
  {
    img: images('./vizzualityhover.png'),
    link: 'http://www.vizzuality.com/',
    title: 'Vizzuality',
  },
  {
    img: images('./wrihover.png'),
    link: 'http://www.wri.org/',
    title: 'World Resources Institute',
  },
];

const partnersCollaborators = [
  {
    img: images('./afchover.png'),
    link: 'http://www.afd.fr/home',
    title: 'Agence Française Développement',
  },
  {
    img: images('./agrosatelitehover.png'),
    link: 'http://agrosatelite.com.br/',
    title: 'agrosatelite',
  },
  {
    img: images('./airbushover.png'),
    link: 'http://www.airbus.com/',
    title: 'Airbus',
  },
  {
    img: images('./astrodigitalhover.png'),
    link: 'https://astrodigital.com/',
    title: 'Astro Digital',
  },
  {
    img: images('./bnpbhover.png'),
    link: 'https://bnpb.go.id/',
    title: 'Badan Nasional Penanggulangan Bencana',
  },
  {
    img: images('./beihover.png'),
    link:
      'http://www.cisl.cam.ac.uk/business-action/sustainable-finance/banking-environment-initiative',
    title: 'Banking Environment Initiative',
  },
  {
    img: images('./cambridgehover.png'),
    link: 'http://www.cisl.cam.ac.uk/',
    title: 'University of Cambridge',
  },
  {
    img: images('./cargillhover.png'),
    link: 'https://www.cargill.com/',
    title: 'Cargill',
  },
  {
    img: images('./cgiarhover.png'),
    link: 'http://foreststreesagroforestry.org/',
    title: 'Forest, Trees and Agroforestry',
  },
  {
    img: images('./ciathover.png'),
    link: 'http://ciat.cgiar.org/',
    title: 'CIAT',
  },
  {
    img: images('./cluahover.png'),
    link: 'http://www.climateandlandusealliance.org/',
    title: 'Climate and Land Use Alliance',
  },
  {
    img: images('./conaforhover.png'),
    link: 'http://www.conafor.gob.mx/',
    title: 'Conafor',
  },
  {
    img: images('./conservationinternationalhover.png'),
    link: 'http://www.conservation.org/Pages/default.aspx',
    title: 'Conservation International',
  },
  {
    img: images('./digitalglobehover.png'),
    link: 'https://www.digitalglobe.com/',
    title: 'DigitalGlobe',
  },
  {
    img: images('./ejnhover.png'),
    link: 'http://earthjournalism.net/',
    title: 'Earth Journalism Network',
  },
  {
    img: images('./ewmihover.png'),
    link: 'http://www.ewmi.org/',
    title: 'East West Management Institute',
  },
  {
    img: images('./evidensiahover.png'),
    link: 'https://www.evidensia.eco/',
    title: 'Evidensia',
  },
  {
    img: images('./hakahover.png'),
    link: 'http://www.haka.or.id/',
    title: 'Haka',
  },
  {
    img: images('./icfhover.png'),
    link: 'http://www.icf.gob.hn/',
    title: 'ICF',
  },
  {
    img: images('./inabhover.png'),
    link: 'http://www.inab.gob.gt/',
    title: 'inab',
  },
  {
    img: images('./ioihover.png'),
    link: 'http://europe.ioiloders.com/taking-responsibility',
    title: 'IOI Loders Croklaan',
  },
  {
    img: images('./jjfasthover.png'),
    link: 'http://www.eorc.jaxa.jp/jjfast/',
    title: 'JICA-JAXA Forest Early Warning System in the Tropics',
  },
  {
    img: images('./lapighover.png'),
    link: 'https://www.lapig.iesa.ufg.br/lapig/',
    title: 'LAPIG',
  },
  {
    img: images('./minepathover.png'),
    link: 'http://www.minepat.gov.cm/index.php/en/?lang=en',
    title: 'Minepat',
  },
  {
    img: images('./ministierehover.png'),
    link: '#',
    title: 'minfof',
  },
  {
    img: images('./moiseshover.png'),
    link: 'http://aidev.in/fmb/',
    title: 'Fundation Moises Bertoni',
  },
  {
    img: images('./mongabayhover.png'),
    link: 'https://www.mongabay.com/',
    title: 'Mongabay',
  },
  {
    img: images('./muyissihover.png'),
    link: '#',
    title: 'Muyissi',
  },
  {
    img: images('./opendevcamhover.png'),
    link: 'https://opendevelopmentcambodia.net/',
    title: 'Open Development Cambodia',
  },
  {
    img: images('./orbitalhover.png'),
    link: 'https://orbitalinsight.com/',
    title: 'Orbital Insight',
  },
  {
    img: images('./osinforhover.png'),
    link: 'http://www.osinfor.gob.pe/',
    title: 'Osinfor',
  },
  {
    img: images('./planet.png'),
    link: 'https://www.planet.com/',
    title: 'Planet',
  },
  {
    img: images('./rfukhover.png'),
    link: 'http://www.rainforestfoundationuk.org/',
    title: 'Rainforest Foundation UK',
  },
  {
    img: images('./raisghover.png'),
    link: 'https://raisg.socioambiental.org/',
    title: 'RAISG',
  },
  {
    img: images('./reddhover.png'),
    link: 'http://www.redd-indonesia.org/',
    title: 'REDD Indonesia',
  },
  {
    img: images('./rmhover.png'),
    link: 'http://www.reforestamosmexico.org/',
    title: 'Refores@amos Mexico',
  },
  {
    img: images('./resolvehover.png'),
    link: 'http://www.resolv.org/site-BiodiversityWildlifeSolutions/',
    title: 'Resolve',
  },
  {
    img: images('./rspohover.png'),
    link: 'http://www.rspo.org/',
    title: 'RSPO',
  },
  {
    img: images('./rtrshover.png'),
    link: 'http://www.responsiblesoy.org/?lang=en',
    title: 'RTRS',
  },
  {
    img: images('./unepwcmchover.png'),
    link: 'http://www.unep-wcmc.org/',
    title: 'UNEP & WCMC',
  },
  {
    img: images('./unileverhover.png'),
    link: 'https://www.unilever.com/',
    title: 'Unilever',
  },
  {
    img: images('./whrchover.png'),
    link: 'http://whrc.org/',
    title: 'Woods Hole Research Center',
  },
];

const funders = [
  {
    img: images('./cargillhover.png'),
    link: 'https://www.cargill.com/',
    title: 'Cargill',
  },
  {
    img: images('./gefhover.png'),
    link: 'http://www.thegef.org/',
    title: 'gef',
  },
  {
    img: images('./generationhover.png'),
    link: 'https://www.genfound.org/',
    title: 'Generation Foundation',
  },
  {
    img: images('./idbhover.png'),
    link: 'http://www.iadb.org/en/inter-american-development-bank,2837.html',
    title: 'IDB',
  },
  {
    img: images('./idbinvesthover.png'),
    link: 'http://www.idbinvest.org/',
    title: 'IDB | Invest',
  },
  {
    img: images('./macarthurhover.png'),
    link: 'https://www.macfound.org/',
    title: 'MacArthur Foundation',
  },
  {
    img: images('./norwegianministrihover.png'),
    link:
      'https://www.regjeringen.no/en/topics/climate-and-environment/climate/climate-and-forest-initiative/id2000712/',
    title: 'Norwegian Ministry',
  },
  {
    img: images('./ukaidhover.png'),
    link:
      'https://www.gov.uk/government/organisations/department-for-international-development',
    title: 'UKAID',
  },
  {
    img: images('./usaidhover.png'),
    link: 'https://www.usaid.gov/',
    title: 'USAID',
  },
];

const mapStateToProps = () => ({
  foundingPartners,
  partnersCollaborators,
  funders,
});

export default connect(mapStateToProps, null)(Component);
