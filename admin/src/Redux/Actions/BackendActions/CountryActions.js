export const editCountry = (countryId) => {
    return {
        type: "EDIT_COUNTRY",
        payload: {
            data: countryId
        }
    }
}

export const showState = (countryId) => {
    return {
        type: "SHOW_STATE",
        payload: {
            datas: countryId
        }
    }
}