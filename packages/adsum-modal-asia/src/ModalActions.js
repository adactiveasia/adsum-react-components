// @flow

export const OPEN_MODAL = 'OPEN_MODAL';
export const SET_MODAL = 'SET_MODAL';
export const SET_MODAL_STRUCTURE = 'SET_MODAL_STRUCTURE';
export const REMOVE_MODAL_STRUCTURE = 'REMOVE_MODAL_STRUCTURE';
export const REMOVE_ALL_MODAL_STRUCTURE = 'REMOVE_ALL_MODAL_STRUCTURE';
export const SET_POI = 'SET_POI';
export const SET_POI_STRUCTURE = 'SET_POI_STRUCTURE';
export const REMOVE_POI_STRUCTURE = 'REMOVE_POI_STRUCTURE';
export const REMOVE_ALL_POI_STRUCTURE = 'REMOVE_ALL_POI_STRUCTURE';

let save;
let saveModal;
let newValue;
let modalName;
let backClicked = false;

export function openModal(value) {
    if (value === true) {
        if (save && saveModal && !backClicked
            && save === value && saveModal === modalName) {
            save = false;
            newValue = false;
            saveModal = null;
            modalName = null;
        } else {
            save = value;
            newValue = value;
            saveModal = modalName;
            backClicked = false;
        }
    } else {
        save = false;
        newValue = false;
        saveModal = null;
        modalName = null;
        backClicked = false;
    }
    return (dispatch) => {
        dispatch({
            type: OPEN_MODAL,
            payload: newValue
        });
    };
}

export function modalToggle(value) {
    backClicked = value;
}

export function setModal(value) {
    modalName = value;
    if (backClicked) {
        openModal(true);
    }
    return (dispatch) => {
        dispatch({
            type: SET_MODAL,
            payload: value
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

export function setPoi(poi) {
    return (dispatch) => {
        dispatch({
            type: SET_POI,
            payload: poi
        });
    };
}

export function setPoiStructure(name) {
    return (dispatch) => {
        dispatch({
            type: SET_POI_STRUCTURE,
            payload: name
        });
    };
}

export function removePoiStructure() {
    return (dispatch) => {
        dispatch({
            type: REMOVE_POI_STRUCTURE
        });
    };
}

export function removeAllPoiStructure() {
    return (dispatch) => {
        dispatch({
            type: REMOVE_ALL_POI_STRUCTURE
        });
    };
}