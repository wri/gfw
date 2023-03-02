import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import Switch from 'components/ui/switch';
import cx from 'classnames';

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
      groupSentence,
      toggle,
    } = this.props;
    const isToggleSelector = !!toggle;
    const isGroupsSelector = groups && !!groups.length;

    const selectorName = selected?.group || name;
    const selectorOptions = isGroupsSelector
      ? groups
      : sortBy(options, 'position');
    const selectorValue = isGroupsSelector
      ? selectedGroup && selectedGroup.value
      : selected;
    const selectorSentence = isGroupsSelector ? groupSentence : sentence;

    return (
      <div className={`c-layer-selector-menu ${className || ''}`}>
        <div
          className={cx('menu-wrapper', {
            '-group': isGroupsSelector,
            '-toggle': isToggleSelector,
          })}
        >
          {isToggleSelector ? (
            <Switch
              theme="theme-switch-light-alternate"
              value={selected?.value}
              options={options}
              name={selectorName}
              onChange={(e) => onChange(layerGroup, e)}
            />
          ) : (
            <SentenceSelector
              options={selectorOptions}
              value={selectorValue}
              name={selectorName}
              sentence={selectorSentence}
              onChange={(e) => onChange(layerGroup, e)}
            />
          )}
        </div>
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
  selectedGroup: PropTypes.object,
  toggle: PropTypes.bool,
};

export default LayerSelectorMenu;
