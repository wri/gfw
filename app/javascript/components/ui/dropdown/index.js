import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isTouch } from 'utils/browser';
import { deburrUpper } from 'utils/data';
import groupBy from 'lodash/groupBy';
import remove from 'lodash/remove';

import Component from './dropdown-component';

const mapStateToProps = (
  { modalMeta },
  { value, options, noSelectedValue }
) => {
  const activeValue =
    options && (typeof value === 'string' || typeof value === 'number')
      ? options.find(o => o.value === value)
      : value;
  const activeLabel = (activeValue && activeValue.label) || noSelectedValue;

  return {
    modalOpen: modalMeta ? modalMeta.open : false,
    modalClosing: modalMeta ? modalMeta.closing : false,
    isDeviceTouch: isTouch(),
    activeValue,
    activeLabel
  };
};

class DropdownContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isOpen: false,
      showGroup: '',
      highlightedIndex: 0
    };
  }

  filterItems = () => {
    const { inputValue } = this.state;
    const { options, groupKey } = this.props;

    return groupBy(
      inputValue
        ? options.filter(
            item =>
              deburrUpper(item.label).indexOf(deburrUpper(inputValue)) > -1
          )
        : options,
      groupKey || 'group'
    );
  };

  getGroupedItems = () => {
    const newItems = this.filterItems();
    const groups = remove(Object.keys(newItems), r => r !== 'undefined');
    const list = newItems.undefined || [];
    const listWithGroups = list.concat(
      groups.map(g => ({ label: g, value: g, groupParent: g }))
    );
    let listWithGroupsAndItems = listWithGroups;
    groups.forEach(g => {
      listWithGroupsAndItems = listWithGroupsAndItems.concat(newItems[g]);
    });
    return listWithGroupsAndItems;
  };

  handleStateChange = (changes, downshiftStateAndHelpers) => {
    if (!downshiftStateAndHelpers.isOpen) {
      this.setState({ inputValue: '' });
    } else if ((changes && changes.inputValue) || changes.inputValue === '') {
      this.setState({ inputValue: changes.inputValue, highlightedIndex: 0 });
    }
    if (changes && changes.selectedItem) {
      this.setState({ isOpen: false, inputValue: '' });
    }
    if (Object.keys(changes).indexOf('isOpen') > -1) {
      this.setState({ inputValue: '' });
    }
    if (
      (changes && changes.highlightedIndex) ||
      changes.highlightedIndex === 0
    ) {
      this.setState({ highlightedIndex: changes.highlightedIndex });
    }
  };

  checkModalClosing = () => {
    const { modalOpen, modalClosing } = this.props;
    if (!modalOpen && !modalClosing) {
      this.setState({ isOpen: false });
    }
  };

  onInputClick = () => {
    const { searchable } = this.props;
    const { isOpen } = this.state;
    if (!searchable && isOpen) {
      this.setState({ isOpen: false, showGroup: '' });
    } else {
      this.setState({ isOpen: true, inputValue: '' });
    }
  };

  onSelectorClick = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen, inputValue: '' });
  };

  handleClearSelection = () => {
    const { onChange } = this.props;
    onChange();
    this.setState({ isOpen: false, showGroup: '', inputValue: '' });
  };

  handleSelectGroup = item => {
    const { showGroup } = this.state;
    this.setState({
      showGroup: item.groupParent === showGroup ? '' : item.groupParent,
      isOpen: true
    });
  };

  handleKeyEnter = e => {
    const { showGroup, highlightedIndex } = this.state;
    if (e.key === 'Enter') {
      const groupedItems = this.getGroupedItems();
      const selected = groupedItems[highlightedIndex];
      if (selected && selected.groupParent) {
        e.persist();
        e.preventDownshiftDefault = true;
        this.setState({
          showGroup:
            showGroup === selected.groupParent ? '' : selected.groupParent
        });
      }
    }
  };

  buildInputProps = getInputProps => {
    const { isOpen } = this.state;
    const { searchable, placeholder } = this.props;
    return getInputProps({
      placeholder: isOpen && searchable ? placeholder : '',
      onClick: this.onInputClick,
      readOnly: !isOpen || !searchable,
      onKeyDown: e => this.handleKeyEnter(e)
    });
  };

  render() {
    const { isOpen, showGroup, inputValue, highlightedIndex } = this.state;

    return createElement(Component, {
      ...this.props,
      isOpen,
      showGroup,
      inputValue,
      highlightedIndex,
      checkModalClosing: this.checkModalClosing,
      handleStateChange: this.handleStateChange,
      onInputClick: this.onInputClick,
      onSelectorClick: this.onSelectorClick,
      handleClearSelection: this.handleClearSelection,
      buildInputProps: this.buildInputProps,
      handleSelectGroup: this.handleSelectGroup,
      items: this.getGroupedItems()
    });
  }
}

DropdownContainer.propTypes = {
  modalOpen: PropTypes.bool,
  modalClosing: PropTypes.bool,
  searchable: PropTypes.bool,
  options: PropTypes.array,
  groupKey: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

export default connect(mapStateToProps, null)(DropdownContainer);
