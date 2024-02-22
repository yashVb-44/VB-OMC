export const editCustomization = (customizationId) => {
    return {
        type: "EDIT_CUSTOMIZATION",
        payload: {
            data: customizationId
        }
    }
}

export const showCustomization = (customizationId) => {
    return {
        type: "SHOW_CUSTOMIZATION",
        payload: {
            datas: customizationId
        }
    }
}

export const showCustomizationSegment = (sizeId) => {
    return {
        type: "SHOW_CUSTOMIZATION_SIZE",
        payload: {
            sizedata: sizeId
        }
    }
}