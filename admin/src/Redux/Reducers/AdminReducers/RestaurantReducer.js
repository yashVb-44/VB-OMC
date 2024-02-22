const initialState = {
    payload: []
}


const RestaurantDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_RESTAURANT":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default RestaurantDataChange 