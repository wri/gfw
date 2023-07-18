### Timestep

Based on rc-slider, for more configuration, take a look at the offical [documentation](http://react-component.github.io/slider/)

```js

initialState = {
  start: 0,
  end: 50
};

<Timestep
  range={false}
  canPlay={true}
  formatValue={value => `${value}%`}
  min={0}
  max={100}
  start={state.start}
  end={state.end}
  trim={100}
  value={state.end}
  step={1}
  speed={200}
  handleOnChange={values => { setState({ start: values[0], end: values[1] })}}
  marks={{
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  }}
  trackStyle={[
    {
      backgroundColor: '#c32d7b',
      borderRadius: '0px'
    }
  ]}
/>
```

```js

initialState = {
  start: 0,
  end: 20,
  trim: 20
};

<Timestep
  canPlay={true}
  formatValue={value => `${value}%`}
  min={0}
  max={100}
  minGap={5}
  maxGap={20}
  start={state.start}
  end={state.end}
  trim={state.trim}
  step={1}
  speed={500}
  handleOnChange={values => { setState({ start: values[0], end: values[1], trim: values[2] })}}
  marks={{
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  }}
  trackStyle={[
    {
      backgroundColor: '#c32d7b',
      borderRadius: '0px'
    },
    {
      backgroundColor: '#F660AE',
      borderRadius: '0px'
    }
  ]}
/>
```
