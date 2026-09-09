import reducers, { initialState } from '../reducers';
import { setModalMetaSettings } from '../actions';

describe('modal metadata reducer', () => {
  it('stores metakey and metaType from typed metadata settings', () => {
    const state = reducers[setModalMetaSettings](initialState, {
      payload: { metakey: 'widget_tree_cover_loss', metaType: 'widget' },
    });

    expect(state.metakey).toBe('widget_tree_cover_loss');
    expect(state.metaType).toBe('widget');
  });

  it('keeps legacy string settings compatible', () => {
    const state = reducers[setModalMetaSettings](
      { ...initialState, metaType: 'widget' },
      { payload: 'umd_tree_cover_loss' }
    );

    expect(state.metakey).toBe('umd_tree_cover_loss');
    expect(state.metaType).toBeUndefined();
  });
});
