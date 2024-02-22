export const editCity = (cityId) => {
    return {
        type: "EDIT_CITY",
        payload: {
            data: cityId
        }
    }
}