
export default function mapReducer(state = {
	floorRects: [],
	wallRects: [],
	staticLights: [],
}, action) {
	switch (action.type) {
		case 'ADD_STATIC_LIGHT':
			const newStaticLights = [...state.staticLights]
			newStaticLights.push(action.payload)
			return {
				...state,
				staticLights: newStaticLights,
			}
		case 'ADD_FLOOR_RECT':
			const newFloorRects = [...state.floorRects]
			newFloorRects.push(action.payload)
			return {
				...state,
				floorRects: newFloorRects,
			}
		case 'ADD_WALL_RECT':
			const newWallRects = [...state.wallRects]
			newWallRects.push(action.payload)
			return {
				...state,
				wallRects: newWallRects,
			}
		default:
			return state
	}
}