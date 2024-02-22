export const editWarningLabels = (warningLabelId) => {
    return {
        type: "EDIT_WARNING_LABEL",
        payload: {
            data: warningLabelId
        }
    }
}