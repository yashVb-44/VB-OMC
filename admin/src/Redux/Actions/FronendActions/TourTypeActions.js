export const editTourType = (tourId) => {
    return {
        type: "EDIT_TOUR_TYPE",
        payload: {
            data: tourId
        }
    }
}