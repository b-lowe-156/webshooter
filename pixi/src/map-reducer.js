
export default function mapReducer(state = {
	floorRects: [],
	wallRects: [],
	staticLights: [],
	polygons: [[[-100, -100], [800 + 1, -100], [800 + 1, 600 + 1], [-100, 600 + 1]]],
}, action) {
	switch (action.type) {
		case 'MAP_LOADED':
			{
				const newFloorRects = [...state.floorRects]
				const newWallRects = [...state.wallRects]
				const newPolygons = [...state.polygons]
				$(action.payload).find('g').each((i, g) => {
					const wall = g.id === 'layer2'
					const type = wall && 'ADD_WALL_RECT' || 'ADD_FLOOR_RECT'
					for (let i = 0; i < g.children.length; i++) {
						const rect = g.children[i]
						const newObj = {
							id: i,
							x: rect.x.baseVal.value,
							y: rect.y.baseVal.value,
							width: rect.width.baseVal.value,
							height: rect.height.baseVal.value,
							rotation: (rect.transform && rect.transform.baseVal[0] && rect.transform.baseVal[0].angle) || 0
						}
						if (wall) {
							newWallRects.push(newObj)
							newPolygons.push([[rect.x.baseVal.value, rect.y.baseVal.value],
							[rect.x.baseVal.value + rect.width.baseVal.value, rect.y.baseVal.value],
							[rect.x.baseVal.value + rect.width.baseVal.value, rect.y.baseVal.value + rect.height.baseVal.value],
							[rect.x.baseVal.value, rect.y.baseVal.value + rect.height.baseVal.value]]);
						} else {
							newFloorRects.push(newObj)
						}
					}
				})
				return {
					...state,
					floorRects: newFloorRects,
					wallRects: newWallRects,
					polygons: newPolygons,
				}
			}
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