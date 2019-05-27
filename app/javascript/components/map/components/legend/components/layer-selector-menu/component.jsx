import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SentenceSelector from 'components/sentence-selector';

import './styles.scss';

class LayerSelectorMenu extends PureComponent {
  render() {
    const {
      name,
      layerGroup,
      selected,
      selectedGroup,
      options,
      groups,
      onChange,
      className,
      sentence,
      groupSentence
    } = this.props;
    const optionName = selected.group || name;

    return (
      <div className={`c-layer-selector-menu ${className || ''}`}>
        {groups &&
          !!groups.length && (
            <div className="menu-wrapper -group">
              <SentenceSelector
                options={groups}
                value={selectedGroup && selectedGroup.value}
                onChange={e => onChange(layerGroup, e)}
                name={optionName}
                sentence={groupSentence}
              />
            </div>
          )}
        {options &&
          !!options.length && (
            <div className="menu-wrapper">
              <SentenceSelector
                options={options}
                value={selected}
                onChange={e => onChange(layerGroup, e)}
                name={optionName}
                sentence={sentence}
              />
            </div>
          )}
      </div>
    );
  }
}

LayerSelectorMenu.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  groups: PropTypes.array,
  layerGroup: PropTypes.object,
  onChange: PropTypes.func,
  selected: PropTypes.object,
  sentence: PropTypes.string,
  groupSentence: PropTypes.string,
  selectedGroup: PropTypes.object
};

export default LayerSelectorMenu;
