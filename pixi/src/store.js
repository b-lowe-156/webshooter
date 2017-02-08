import { combineReducers, createStore, compose } from 'redux'

import DevTools from './DevTools'
import playerReducer from './player-reducer'
import inputReducer from './input-reducer'

const enhancer = compose(
    DevTools.instrument()
)

const reducers = combineReducers({
	player: playerReducer,
	input: inputReducer,
})

export default createStore(reducers, {}, enhancer)