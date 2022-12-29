import PropTypes from 'prop-types';
/* eslint-disable react/no-danger */
import { Row, Column } from 'gfw-components';

import Icon from 'components/ui/icon';

import './styles.scss';

const GrantsAboutSection = ({ about }) => {
  console.log({ about });
  return (
    <div className="l-grants-about-section">
      {about?.map((section) => (
        <>
          <section className="intro">
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
                    {c.acf_fc_layout === 'paragraph' && (
                      <p
                        qclassName="text -paragraph -color-2 -light -spaced"
                        dangerouslySetInnerHTML={{ __html: c.text }}
                      />
                    )}
                    {c.acf_fc_layout === 'subtitle' && (
                      <h3
                        className="section-subtitle"
                        dangerouslySetInnerHTML={{ __html: c.text }}
                      />
                    )}

                    {c.acf_fc_layout === 'icons' && (
                      <Row nested className="icon-list">
                        {c.item.map((item) => (
                          <Column width={[1, 1 / 3]} key={item.text}>
                            <Icon icon={item.image.url} />
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
