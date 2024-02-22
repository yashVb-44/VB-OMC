const initialState = {
    payload: []
}


const BlogsDataChange = (state = initialState, action) => {
    switch (action.type) {
        case "EDIT_BLOGS":
            const { data } = action.payload
            return {
                payload: data
            }

        default:
            return state
    }
}

export default BlogsDataChange