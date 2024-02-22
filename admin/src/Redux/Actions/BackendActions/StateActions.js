export const editState = (stateId) => {
    return {
        type: "EDIT_STATE",
        payload: {
            data: stateId
        }
    }
}

export const showCity = (stateId) => {
    return {
        type: "SHOW_CITY",
        payload: {
            datas: stateId
        }
    }
}