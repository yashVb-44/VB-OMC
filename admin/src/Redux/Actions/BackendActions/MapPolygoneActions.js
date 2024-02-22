export const addPolygoneOnMap = (mapId) => {
    return {
        type: "ADD_POLYGONE_ON_MAP",
        payload: {
            data: mapId
        }
    }
}