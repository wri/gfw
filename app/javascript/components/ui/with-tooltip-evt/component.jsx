import React, { PureComponent } from 'react';

const withTooltipEvt = Component => {
  class TooltipContent extends PureComponent {
    evt = null;

    clearEvt() {
      this.evt = null;
    }

    setEvt = e => {
      e.persist();
      this.evt = e.target;
    };

    getTooltipContentProps = () => ({
      onClickCapture: this.setEvt
    });

    render() {
      return (
        <Component
          {...this.props}
          getTooltipContentProps={this.getTooltipContentProps}
        />
      );
    }
  }

  return TooltipContent;
};

export default withTooltipEvt;
