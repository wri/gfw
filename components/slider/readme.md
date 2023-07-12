### Default slider

```js

initialState = { value: 50 };

<Slider
  min={0}
  max={100}
  value={state.value}
  onChange={(value) => { setState({ value }); }}
  trackStyle={{
    backgroundColor: '#c32d7b',
    borderRadius: '0px'
  }}
/>
```

### Range slider


```js

initialState = { value: [25, 75] };

<Slider
  min={0}
  max={100}
  range
  value={state.value}
  onChange={(value) => { setState({ value }); }}
  trackStyle={[{
    backgroundColor: '#c32d7b',
    borderRadius: '0px'
  }]}
/>
```
