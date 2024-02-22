export const editArea = (areaId) => {
    return {
        type: "EDIT_AREA",
        payload: {
            data: areaId
        }
    }
}