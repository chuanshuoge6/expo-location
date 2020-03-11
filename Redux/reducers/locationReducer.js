export default function reducer(
    state = {
        locations: []
    },
    action
) {
    switch (action.type) {

        case "add": {
            return { ...state, locations: state.locations.concat(action.payload) }
        }

        case "delete": {
            return { ...state, locations: [] }
        }
    }
    return state;
}