const initialState = {
    payload: []
}


const TourTypeDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_TOUR_TYPE":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default TourTypeDataChange