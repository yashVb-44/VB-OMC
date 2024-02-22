export const editZone = (zoneId) => {
    return {
        type: "EDIT_ZONE",
        payload: {
            data: zoneId
        }
    }
}