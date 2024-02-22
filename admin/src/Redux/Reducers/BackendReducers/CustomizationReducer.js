const initialState = {
    payload: []
}


const CustomizationDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_CUSTOMIZATION":
            const { data } = action.payload
            return {
                payload: data
            }

        case "SHOW_CUSTOMIZATION":
            const { datas } = action.payload
            return {
                payload: datas
            }


        default:
            return state
    }
}

const CustomizationSegmentDataChange = (state = initialState, action) => {
    switch (action.type) {

        case "SHOW_CUSTOMIZATION_SIZE":
            const { sizedata } = action.payload
            return {
                payload: sizedata
            }


        default:
            return state
    }
}



export { CustomizationDataChange, CustomizationSegmentDataChange }