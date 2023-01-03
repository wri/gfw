import PropTypes from 'prop-types';
import parse from 'html-react-parser';
/* eslint-disable react/no-danger */
import { Row, Column } from 'gfw-components';

import { htmlParser } from 'utils/html-parser';

import './styles.scss';

const GrantsAboutSection = ({ about }) => {
  return (
    <div className="l-grants-about-section">
      {about?.map((section) => (
        <>
          <section
            className="intro"
            key={section.title.split(' ').join('-').toLowerCase()}
          >
            <Row className="intro">
              <Column width={[1, 3 / 4]}>
                <h2
                  className="section-title"
                  id={section.title.split(' ').join('-').toLowerCase()}
                >
                  {section.title}
                </h2>
                {section.content.map((c) => (
                  <>
                    <Row className="section">
                      {c.acf_fc_layout === 'paragraph' && <>{parse(c.text)}</>}
                      {c.acf_fc_layout === 'subtitle' && (
                        <h3
                          className="section-subtitle"
                          dangerouslySetInnerHTML={{ __html: c.text }}
                        />
                      )}
                    </Row>

                    {c.acf_fc_layout === 'icons' && (
                      <Row nested className="icon-list">
                        {c.item.map((item) => (
                          <Column width={[1, 1 / 3]} key={item.text}>
                            <img
                              src={item.image.url}
                              alt={htmlParser(item.text)}
                            />
                            <p
                              dangerouslySetInnerHTML={{ __html: item.text }}
                            />
                          </Column>
                        ))}
                      </Row>
                    )}
                  </>
                ))}
              </Column>
              <Column width={[1, 1 / 4]} className="logo">
                <img
                  src={section.image.url}
                  alt="Logo Global Forest Watch Small Grant Funds"
                />
              </Column>
            </Row>
          </section>
        </>
      ))}
    </div>
  );
};

GrantsAboutSection.propTypes = {
  about: PropTypes.array,
};

export default GrantsAboutSection;
