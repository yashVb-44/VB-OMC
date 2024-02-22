const initialPolygone = {
    payload: []
}


const MapPolyGoneDataChange = (state = initialPolygone, action) => {
    switch (action.type) {
        case "ADD_POLYGONE_ON_MAP":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default MapPolyGoneDataChange 