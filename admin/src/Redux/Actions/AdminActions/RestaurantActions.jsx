export const editRestaurant = (restaurantId) => {
    return {
        type: "EDIT_RESTAURANT",
        payload: {
            data: restaurantId
        }
    }
}
