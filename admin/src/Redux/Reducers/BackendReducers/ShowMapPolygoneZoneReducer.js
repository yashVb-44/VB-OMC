const initialState = {
    payload: []
}


const ShowMapPolygoneZoneDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "SHOW_MAP_POLYGONE_ZONE":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default ShowMapPolygoneZoneDataChange