import { Carousel, Row, Column } from '@worldresources/gfw-components';

import img1997 from 'layouts/about/history/images/1997.jpg';
import img2014 from 'layouts/about/history/images/2014.jpg';
import img2015 from 'layouts/about/history/images/2015.jpg';
import img2016 from 'layouts/about/history/images/2016.jpg';
import img2017 from 'layouts/about/history/images/2017.jpg';
import img2018 from 'layouts/about/history/images/2018.png';
import img2019 from 'layouts/about/history/images/2019.png';
import img2020 from 'layouts/about/history/images/2020.png';
import img2021 from 'layouts/about/history/images/2021.png';
import img2021b from 'layouts/about/history/images/2021b.jpg';
import img2024 from 'layouts/about/history/images/2024.png';

const data = [
  {
    img: img1997,
    imgPosition: 'center',
    title: '1997',
    paragraph:
      'The World Resources Institute (WRI) established Global Forest Watch in 1997 as part of the Forest Frontiers Initiative. It started as a network of NGOs producing up-to-date reports about the state of forests in four pilot countries: Cameroon, Canada, Gabon, and Indonesia.',
  },
  {
    img: img2014,
    imgPosition: 'left',
    title: '2014',
    paragraph:
      'In 2014, WRI launched GFW 2.0, building on nearly two decades of work to create a fully interactive online platform with forest monitoring data for the whole world. The new iteration of GFW was made possible by advances in forest monitoring technology and an expanded group of partners.',
  },
  {
    img: img2015,
    imgPosition: 'right',
    title: '2015',
    paragraph:
      'To address the many challenges related to deforestation, Global Forest Watch began expanding with several new web applications: GFW Commodities to evaluate sustainability in commodity supply chains, and GFW Fires to monitor forest and land fires and haze in SE Asia',
  },
  {
    img: img2016,
    imgPosition: 'left',
    title: '2016',
    paragraph:
      'With further developments in satellite technology, GFW grew beyond annual data on forests and began providing monthly and weekly deforestation alerts. Email subscriptions brought these alerts directly into the hands of users, increasing their ability to respond to new activity in near real-time.',
  },
  {
    img: img2017,
    imgPosition: 'center',
    title: '2017',
    paragraph:
      'In 2017, GFW launched Forest Watcher, a mobile application that lets users take GFW’s data and tools offline and into the field. The app represents a new step in connecting the people working in forests directly with the information they need to protect them.',
  },
  {
    img: img2018,
    imgPosition: 'center',
    title: '2018',
    paragraph:
      'GFW released new data that show the dominant drivers of tree cover loss, including those that result in deforestation. GFW also released new and improved dashboards to deliver insights about the causes and impacts of forest change.',
  },
  {
    img: img2019,
    imgPosition: 'center',
    title: '2019',
    paragraph:
      'Stemming from collaboration with leading financial and commodity companies, GFW Pro was launched in 2019 to aid businesses intent on managing deforestation risk in their supply chains. Meanwhile, the addition of high-resolution Planet basemaps, plantations data for 82 countries and pan-tropical primary forest data gave users a new way to understand forest change on the GFW map.',
  },
  {
    img: img2020,
    imgPosition: 'center',
    title: '2020',
    paragraph:
      'WRI launched the Global Forest Review, a living report powered by GFW. The Global Forest Review provides peer-reviewed analysis and insights generated from the best available geospatial data on the state of the world’s forests to support the global community working to protect and restore forests worldwide.',
  },
  {
    img: img2021,
    imgPosition: 'center',
    title: '2021',
    paragraph:
      'GFW released new global maps that provide spatially explicit data on emissions, removals and net carbon fluxes from forests.',
  },
  {
    img: img2021b,
    imgPosition: 'center',
    title: '2021',
    subtitle: 'Photo by Beder Olortegui',
    paragraph:
      'GFW partnered on an impact evaluation study that revealed areas where Indigenous forest monitors were equipped with satellite data saw a 52% reduction in deforestation in one year.',
  },
  {
    img: img2024,
    imgPosition: 'center',
    title: '2024',
    paragraph:
      'GFW released its 10<sup>th</sup> annual global tree cover loss data and analysis, a globally recognized data set that provides a regular and standardized assessment on the state of the world’s forests.',
  },
];

const AboutHistorySection = () => (
  <section className="l-section-history">
    <Row>
      <Column>
        <h3>History</h3>
      </Column>
    </Row>
    <Row>
      <Column>
        <Carousel
          settings={{
            slidesToShow: 1,
          }}
        >
          {data &&
            data.map((d) => (
              <div className="year-card" key={d.title}>
                <Row>
                  <Column width={[1, 1 / 2]}>
                    <img className="image" src={d.img} alt={d.title} />
                  </Column>
                  <Column width={[1, 1 / 2]}>
                    <div className="description">
                      <div>
                        <h4>{d.title}</h4>
                        {d.subtitle && <span>{d.subtitle}</span>}
                      </div>
                      {/* eslint-disable-next-line react/no-danger */}
                      <p dangerouslySetInnerHTML={{ __html: d.paragraph }} />
                    </div>
                  </Column>
                </Row>
              </div>
            ))}
        </Carousel>
      </Column>
    </Row>
  </section>
);

export default AboutHistorySection;
