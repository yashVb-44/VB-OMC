export const editMeal = (mealId) => {
    return {
        type: "EDIT_MEAL",
        payload: {
            data: mealId
        }
    }
}