const initialState = {
    payload: []
}


const SubscriptionDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_SUBSCRIPTION":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default SubscriptionDataChange