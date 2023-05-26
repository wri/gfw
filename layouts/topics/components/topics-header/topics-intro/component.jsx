import PropTypes from 'prop-types';
import cx from 'classnames';
import { trackEvent } from 'utils/analytics';

import {
  Desktop,
  Mobile,
  Button,
  Row,
  Column,
} from '@worldresources/gfw-components';

import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg?sprite';
import './styles.scss';

const TopicsIntro = ({ intro = {}, className, handleSkipToTools }) => {
  const { img1x, img2x, title, text, citation, button } = intro;

  const redirectTo = (link) => {
    window.location = link;
  };

  return (
    <div className={cx('c-topics-intro', className)}>
      <Row className="title-row">
        <Column width={[1, 1 / 2]} className="title-col">
          <Desktop>
            <div className="intro-img">
              <img
                {...(img2x && {
                  srcSet: `${img2x} 2x, ${img1x} 1x,`,
                  src: `${img1x} 1x`,
                })}
                {...(!img2x && {
                  src: img1x,
                })}
                alt={title}
              />
            </div>
          </Desktop>
        </Column>
        <Column width={[1, 1 / 2]} className="title-col">
          <h1 className="intro-title">{title}</h1>
          {citation && (
            <a
              className="citation-link"
              href={citation}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent({
                  category: 'Topics pages',
                  action: 'Open citation info button',
                  label: title,
                });
              }}
            >
              <Icon className="citation-icon" icon={infoIcon} />
            </a>
          )}
        </Column>
      </Row>
      <Row>
        <Column width={[1, 1 / 2]} />
        <Column width={[1, 1 / 2]}>
          <p className="intro-text">{text}</p>
          <div className="intro-buttons">
            {button && (
              <Button
                className="intro-btn"
                onClick={() => redirectTo(button.link)}
              >
                {button.text}
              </Button>
            )}
            <Desktop>
              <Button
                light
                className="skip-to-tools"
                onClick={handleSkipToTools}
              >
                Related tools
              </Button>
            </Desktop>
          </div>
        </Column>
      </Row>
      <Mobile>
        <div className="intro-img">
          <img
            {...(img2x && {
              srcSet: `${img2x} 2x, ${img1x} 1x,`,
              src: `${img1x} 1x`,
            })}
            {...(!img2x && {
              src: img1x,
            })}
            alt={title}
          />
        </div>
      </Mobile>
    </div>
  );
};

TopicsIntro.propTypes = {
  intro: PropTypes.object,
  className: PropTypes.string,
  handleSkipToTools: PropTypes.func,
};

export default TopicsIntro;
