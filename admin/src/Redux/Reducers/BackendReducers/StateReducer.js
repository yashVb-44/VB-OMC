const initialState = {
    payload: []
}


const StateDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_STATE":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}


const StateCityDataChange = (state = initialState, action) => {
    switch (action.type) {

        case "SHOW_CITY":
            const { datas } = action.payload
            return {
                payload: datas
            }


        default:
            return state
    }
}


export { StateDataChange, StateCityDataChange }