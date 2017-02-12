import { combineReducers, createStore, compose } from 'redux'

import DevTools from './DevTools'
import playerReducer from './player-reducer'
import inputReducer from './input-reducer'
import lightReducer from './light-reducer'

const enhancer = compose(
    DevTools.instrument()
)

const reducers = combineReducers({
	player: playerReducer,
	input: inputReducer,
	light: lightReducer,
})

export default createStore(reducers, {}, enhancer)