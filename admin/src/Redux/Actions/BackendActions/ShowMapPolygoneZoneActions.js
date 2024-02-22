export const showMapPolygoneZone = (restuarntId) => {
    return {
        type: "SHOW_MAP_POLYGONE_ZONE",
        payload: {
            data: restuarntId
        }
    }
}