
export default function bulletReducer(state = {
	bulletContainer: [],
}, action) {
	switch (action.type) {
		case 'ADD_BULLET':
			{
				const newArray = [...state.bulletContainer]
				newArray.push(action.payload)
				return {
					...state,
					bulletContainer: newArray,
				}
			}
		case 'REMOVE_BULLET':
			{
				const newArray = [...state.bulletContainer]
				const i = state.bulletContainer.indexOf(action.payload)
				newArray.splice(i, 1)
				return {
					...state,
					bulletContainer: newArray,
				}
			}
		case 'TICK': {
				state.bulletContainer.forEach(b => {
					b.bullet.rotation = b.bulletBox.angle
					b.bullet.position.x = b.bulletBox.position.x
					b.bullet.position.y = b.bulletBox.position.y
				})
			}
		default:
			return state
	}
}