const initialState = {
    payload: []
}


const WarningLabelsDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_WARNING_LABEL":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default WarningLabelsDataChange 