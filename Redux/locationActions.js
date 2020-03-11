export function addLocations(locations) {

    return {
        type: 'add',
        payload: locations
    }
}

export function deleteLocations() {
    return {
        type: 'delete'
    }
}