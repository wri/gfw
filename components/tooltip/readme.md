### Click tooltip
```js
<Tooltip
  overlay="Info"
  overlayClassName="c-rc-tooltip -default"
  overlayStyle={{ color: '#fff' }}
  placement="top"
  trigger={['click']}
  mouseLeaveDelay={0}
  destroyTooltipOnHide
>
  <button
    type="button"
  >
    Click me
  </button>
</Tooltip>
```

### Hover tooltip
```js
<Tooltip
  overlay="Info"
  overlayClassName="c-rc-tooltip -default"
  overlayStyle={{ color: '#fff' }}
  placement="top"
  trigger={['hover']}
  mouseLeaveDelay={0}
  destroyTooltipOnHide
>
  <button
    type="button"
  >
    Hover me
  </button>
</Tooltip>

```
