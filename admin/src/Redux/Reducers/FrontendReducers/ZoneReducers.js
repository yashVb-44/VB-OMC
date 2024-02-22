const initialState = {
    payload: []
}


const ZoneDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_ZONE":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default ZoneDataChange