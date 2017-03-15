import { combineReducers, createStore, compose } from 'redux'

import DevTools from './DevTools'
import gameReducer from './game-reducer'
import playerReducer from './player-reducer'
import inputReducer from './input-reducer'
import mapReducer from './map-reducer'

const enhancer = compose(
   DevTools.instrument()
)

const reducers = combineReducers({
	game: gameReducer,
	player: playerReducer,
	input: inputReducer,
	map: mapReducer,
})

export default createStore(reducers, {}, enhancer)