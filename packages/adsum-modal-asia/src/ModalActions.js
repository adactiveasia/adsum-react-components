// @flow

export const OPEN_MODAL = 'OPEN_MODAL';
export const SET_POI = 'SET_POI';
export const SET_POI_PARENT = 'SET_POI_PARENT';
export const SET_PREVIOUS_POI = 'SET_PREVIOUS_POI';

export function openModal(value) {
    return (dispatch) => {
        dispatch({
            type: OPEN_MODAL,
            payload: value
        });
    };
}

export function setPoi(poi) {
    return (dispatch) => {
        dispatch({
            type: SET_POI,
            payload: poi
        });
    };
}

export function setPoiParent(poi) {
    return (dispatch) => {
        dispatch({
            type: SET_POI_PARENT,
            payload: poi
        });
    };
}

export function setPreviousPoi(poi) {
    return (dispatch) => {
        dispatch({
            type: SET_PREVIOUS_POI,
            payload: poi
        });
    };
}
