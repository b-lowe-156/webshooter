import { combineReducers, createStore, compose } from 'redux'

import bulletReducer from './bullet-reducer'
import inputReducer from './input-reducer'
import mapReducer from './map-reducer'
import playerReducer from './player-reducer'

const reducers = combineReducers({
	bullet: bulletReducer,
	input: inputReducer,
	map: mapReducer,
	player: playerReducer,
})

export default createStore(reducers, {})