export const types = {
    SET_PERCENTAGE: 'loadingScreen/SET_PERCENTAGE',
    ADD_PERCENTAGE: 'loadingScreen/ADD_PERCENTAGE',
};

export function setPercentage(percentage) {
    return {
        type: types.SET_PERCENTAGE,
        percentage,
    };
}

export function addPercentage(addValue) {
    return {
        type: types.ADD_PERCENTAGE,
        addValue,
    };
}