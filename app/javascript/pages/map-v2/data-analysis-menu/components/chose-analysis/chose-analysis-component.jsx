import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Dropdown from 'components/ui/dropdown';

import infoIcon from 'assets/icons/info.svg';
import squarePointIcon from 'assets/icons/square-point.svg';
import flagIcon from 'assets/icons/flag.svg';
import polygonIcon from 'assets/icons/polygon.svg';
import config from './upload-file-config.json';
import './chose-analysis-styles.scss';

class ChoseAnalysis extends PureComponent {
  renderLayerOption = () => (
    <div className="c-chose-analysis__layer">
      <div className="c-chose-analysis__layer-title">
        Activate one click-analysis on:
      </div>
      <Dropdown
        className="c-chose-analysis__layer-select"
        theme="theme-dropdown-light"
        placeholder=""
        searchable
        clearable
      />
      <div className="c-chose-analysis__layer-description">
        One-click analysis is also available by default for most data layers
        under the Land Use and Biodiversity tabs, in addition to all Countries
        data layers.
      </div>
    </div>
  );

  renderLocationOption = () => {
    const { countryData, location, setAnalysisData } = this.props;
    return (
      <div className="c-chose-analysis__location">
        <Dropdown
          className="c-chose-analysis__location-select"
          theme="theme-dropdown-light"
          placeholder="Select country"
          noItemsFound="No country found"
          noSelectedValue="Select country"
          options={countryData.countries}
          value={location.country}
          onChange={country =>
            setAnalysisData({
              location: {
                ...location,
                country: country ? country.value : null,
                region: country ? location.region : null,
                subRegion: country ? location.subRegion : null
              }
            })
          }
          searchable
          clearable
        />
        <Dropdown
          className="c-chose-analysis__location-select"
          theme="theme-dropdown-light"
          placeholder="Select region (optional)"
          noItemsFound="No region found"
          noSelectedValue="Select region (optional)"
          options={countryData.regions}
          value={location.region}
          onChange={region =>
            setAnalysisData({
              location: {
                ...location,
                region: region ? region.value : null,
                subRegion: region ? location.subRegion : null
              }
            })
          }
          disabled
          searchable
          clearable
        />
        <Dropdown
          className="c-chose-analysis__location-select"
          theme="theme-dropdown-light"
          placeholder="Select region (optional)"
          noItemsFound="No region found"
          noSelectedValue="Select region (optional)"
          options={countryData.subRegions}
          value={location.subRegion}
          onChange={subRegion =>
            setAnalysisData({
              location: {
                ...location,
                subRegion: subRegion ? subRegion.value : null
              }
            })
          }
          disabled
          searchable
          clearable
        />
        <Button
          onClick={() => {
            setAnalysisData({
              showResults: true
            });
          }}
        >
          ANALYZE
        </Button>
      </div>
    );
  };
  renderPolygonOption = () => (
    <div className="c-chose-analysis__polygon">
      <div className="c-chose-analysis__polygon-title">
        Draw in the map the area you want to analyze or subscribe to
      </div>
      <Button
        onClick={() => {
          const { setAnalysisData } = this.props;
          setAnalysisData({
            polygon: {
              type: 'Polygon',
              coordinates: [
                [
                  [-7.8772, 40.2166],
                  [-7.2565, 40.1579],
                  [-7.2784, 39.8845],
                  [-7.6135, 39.8507],
                  [-7.8772, 40.2166]
                ]
              ]
            }
          });
        }}
      >
        START DRAWING
      </Button>
      <div className="c-chose-analysis__polygon-separator">or</div>
      <Dropzone
        onDrop={this.onDrop}
        className="c-chose-analysis__polygon-input"
      >
        <p>Click to pick a file or drop one here</p>
        <Button className="theme-button-tiny square info-button">
          <Icon icon={infoIcon} className="info-icon" />
        </Button>
      </Dropzone>
    </div>
  );

  onDrop = files => {
    const { uploadShape } = this.props;
    const file = files[0];
    if (file.size > config.sizeLimit && !window.confirm(config.sizeMessage)) {
      return;
    }

    uploadShape(file);
  };

  render() {
    const { selected, setAnalysisData } = this.props;
    return (
      <div className="c-chose-analysis">
        <div className="c-chose-analysis__title">
          ANALYZE AND TRACK FOREST CHANGE
        </div>
        <div className="c-chose-analysis__options">
          <button
            className={selected === 'layer' ? 'selected' : ''}
            onClick={() => {
              setAnalysisData({ option: 'layer', showResults: false });
            }}
          >
            <Icon icon={squarePointIcon} className="icon square-point" />
            <div className="label">CLICK A LAYER ON THE MAP</div>
          </button>
          <button
            className={selected === 'location' ? 'selected' : ''}
            onClick={() => {
              setAnalysisData({ option: 'location', showResults: false });
            }}
          >
            <Icon icon={flagIcon} className="icon flag" />
            <div className="label">SELECT A COUNTRY OR REGION</div>
          </button>
          <button
            className={selected === 'polygon' ? 'selected' : ''}
            onClick={() => {
              setAnalysisData({ option: 'polygon', showResults: false });
            }}
          >
            <Icon icon={polygonIcon} className="icon polygon" />
            <div className="label">DRAW OR UPLOAD SHAPE</div>
          </button>
        </div>
        {selected === 'layer' && this.renderLayerOption()}
        {selected === 'location' && this.renderLocationOption()}
        {selected === 'polygon' && this.renderPolygonOption()}
      </div>
    );
  }
}

ChoseAnalysis.propTypes = {
  selected: PropTypes.string,
  countryData: PropTypes.object,
  location: PropTypes.object,
  setAnalysisData: PropTypes.func,
  uploadShape: PropTypes.func
};

export default ChoseAnalysis;
