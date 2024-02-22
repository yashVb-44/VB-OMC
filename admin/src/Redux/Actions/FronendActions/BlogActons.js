export const editBlogs = (blogId) => {
    return {
        type: "EDIT_BLOGS",
        payload: {
            data: blogId
        }
    }
}