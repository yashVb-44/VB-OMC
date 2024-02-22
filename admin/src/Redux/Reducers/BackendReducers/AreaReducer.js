const initialArea = {
    payload: []
}


const AreaDataChange = (state = initialArea, action) => {
    switch (action.type) {
        case "EDIT_AREA":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default AreaDataChange 