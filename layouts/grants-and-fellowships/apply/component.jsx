import PropTypes from 'prop-types';
import parse from 'html-react-parser';
/* eslint-disable react/no-danger */
import { Row, Column } from '@worldresources/gfw-components';

const GrantsApplySection = ({ apply }) => {
  return (
    <div className="l-grants-apply-section">
      {apply?.map((section) => (
        <>
          <section
            className="intro"
            key={section.title.split(' ').join('-').toLowerCase()}
          >
            <Row className="intro">
              {section.image.url && (
                <Column width={[1, 1 / 4]} className="logo">
                  <img
                    src={section.image.url}
                    alt="Logo Global Forest Watch Small Grant Funds"
                  />
                </Column>
              )}
              <Column width={[1, 3 / 4]}>
                <h2
                  className="section-title"
                  id={section.title.split(' ').join('-').toLowerCase()}
                >
                  {section.title}
                </h2>
              </Column>
              {section.content.map((c) => (
                <>
                  <Column width={[1, 3 / 4]}>
                    {c.acf_fc_layout === 'paragraph' && <>{parse(c.text)}</>}
                    {c.acf_fc_layout === 'subtitle' && (
                      <h2
                        className="section-subtitle"
                        dangerouslySetInnerHTML={{ __html: c.text }}
                      />
                    )}
                  </Column>
                </>
              ))}
            </Row>
          </section>
        </>
      ))}
    </div>
  );
};

GrantsApplySection.propTypes = {
  apply: PropTypes.array,
};

export default GrantsApplySection;
