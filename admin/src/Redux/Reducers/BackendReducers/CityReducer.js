const initialCity = {
    payload: []
}


const CityDataChange = (state = initialCity, action) => {
    switch (action.type) {
        case "EDIT_CITY":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default CityDataChange 