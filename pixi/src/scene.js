
const scene = () => {
	let player
	return {
		render: (state, stage) => {
			if (player !== state.player.player) {
				console.log(state.player.player)
			}
			player = state.player.player
		}
	}
}

export default scene()