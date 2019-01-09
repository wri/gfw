import { handleModule } from 'redux-tools';

// As seen in http://nicolasgallagher.com/redux-modules-and-code-splitting/
class ReducerRegistry {
  constructor() {
    this._emitChange = null;
    this._reducers = {};
  }

  getReducers() {
    return { ...this._reducers };
  }

  registerModule(name, module) {
    const reducer = handleModule(module);
    this._reducers = { ...this._reducers, [name]: reducer };
    if (this._emitChange) {
      this._emitChange(this.getReducers());
    }
  }

  register(name, reducer) {
    this._reducers = { ...this._reducers, [name]: reducer };
    if (this._emitChange) {
      this._emitChange(this.getReducers());
    }
  }

  setChangeListener(listener) {
    this._emitChange = listener;
  }
}

const reducerRegistry = new ReducerRegistry();
export default reducerRegistry;
