// @flow

export const OPEN_MODAL = 'OPEN_MODAL';
export const SET_MODAL = 'SET_MODAL';
export const SET_POI = 'SET_POI';
export const SET_MODAL_STRUCTURE = 'SET_MODAL_STRUCTURE';
export const REMOVE_MODAL_STRUCTURE = 'REMOVE_MODAL_STRUCTURE';
export const REMOVE_ALL_MODAL_STRUCTURE = 'REMOVE_ALL_MODAL_STRUCTURE';
export const SET_PREVIOUS_POI = 'SET_PREVIOUS_POI';

export function openModal(value) {
    return (dispatch) => {
        dispatch({
            type: OPEN_MODAL,
            payload: value
        });
    };
}

export function setModal(value) {
    return (dispatch) => {
        dispatch({
            type: SET_MODAL,
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

export function setModalStructure(name) {
    return (dispatch) => {
        dispatch({
            type: SET_MODAL_STRUCTURE,
            payload: name
        });
    };
}

export function removeModalStructure() {
    return (dispatch) => {
        dispatch({
            type: REMOVE_MODAL_STRUCTURE
        });
    };
}

export function removeAllModalStructure() {
    return (dispatch) => {
        dispatch({
            type: REMOVE_ALL_MODAL_STRUCTURE
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
