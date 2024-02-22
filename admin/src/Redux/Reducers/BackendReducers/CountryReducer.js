const initialCountry = {
    payload: []
}


const CountryDataChange = (country = initialCountry, action) => {
    switch (action.type) {
        case "EDIT_COUNTRY":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return country
    }
}


const CountryStateDataChange = (country = initialCountry, action) => {
    switch (action.type) {

        case "SHOW_STATE":
            const { datas } = action.payload
            return {
                payload: datas
            }


        default:
            return country
    }
}


export { CountryDataChange, CountryStateDataChange }