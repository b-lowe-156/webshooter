import { combineReducers, createStore, compose } from 'redux'

import DevTools from './DevTools'
import playerReducer from './player-reducer'
import mapReducer from './map-reducer'

const enhancer = compose(
  // DevTools.instrument()
)

const reducers = combineReducers({
	player: playerReducer,
	map: mapReducer,
})

export default createStore(reducers, {}, enhancer)