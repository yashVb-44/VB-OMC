export const editSubscription = (subscriptionId) => {
    return {
        type: "EDIT_SUBSCRIPTION",
        payload: {
            data: subscriptionId
        }
    }
}