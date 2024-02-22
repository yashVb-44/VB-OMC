const initialState = {
    payload: []
}


const MealDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_MEAL":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default MealDataChange