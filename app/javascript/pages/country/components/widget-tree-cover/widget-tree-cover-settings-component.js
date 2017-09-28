import React from 'react';
import Select from 'react-select';

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' }
];

function logChange(val) {
  console.log("Selected: " + JSON.stringify(val));
}

const WidgetTreeCoverSettings = () => {
  return (
    <div>
      <div>LOCATION</div>
      <Select
        name="form-field-name"
        value="one"
        options={options}
        onChange={logChange}
      />
    </div>
  );
};

export default WidgetTreeCoverSettings;
